import glob from "fast-glob"
import fsp from 'node:fs/promises'
import { ResolvedConfig } from '../server'
import { PluginContainer, createPluginContainer } from '../server/pluginContainer'
import * as esbuild from 'esbuild'
import type { Plugin, OnLoadResult } from 'esbuild'
import path from 'path'
import { normalizePath } from '../utils'

function shouldExternalizeDep(resolvedId: string, rawId: string): boolean {
  // not a valid file path
  if (!path.isAbsolute(resolvedId)) {
    return true
  }
  // virtual id
  if (resolvedId === rawId || resolvedId.includes('\0')) {
    return true
  }
  return false
}


export const virtualModuleRE = /^virtual-module:.*/
export const virtualModulePrefix = 'virtual-module:'
const htmlTypesRE = /\.(html|vue|svelte|astro|imba)$/

export const scriptRE =
  /(<script(?:\s+[a-z_:][-\w:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^"'<>=\s]+))?)*\s*>)(.*?)<\/script>/gis

const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i


// 计算入口文件
async function computeEntries(config: ResolvedConfig) {
  return await glob("**/*.html", {
    cwd: config.root,
    ignore: ["**/node_modules/**"],
    absolute: true,
    suppressErrors: true // suppress EACCES errors
  })
}

export async function scanImports(config: ResolvedConfig) {
  // 扫描到的依赖，会放到该对象
  const deps: Record<string, string> = {}
  // 缺少的依赖，用于错误提示
  const missing: Record<string, string> = {}
  // 存储所有入口文件的数组
  let entries = await computeEntries(config)


  const esbuildContext = await prepareEsbuildScanner(config, entries, deps, missing)
  await esbuildContext.rebuild()

  return {
    deps,
    missing
  }
}

async function prepareEsbuildScanner(
  config: ResolvedConfig,
  entries: string[],
  deps: Record<string, string>,
  missing: Record<string, string>
) {
  const container = await createPluginContainer(config)

  // esbuild 扫描插件，这个是重点！！！
  const plugin = esbuildScanPlugin(config, container, deps, missing, entries)
  
  return await esbuild.context({
    absWorkingDir: process.cwd(),
    write: false,
    bundle: true,
    stdin: {
      contents: entries.map((e) => `import ${JSON.stringify(e)}`).join('\n'),
      loader: 'js',
    },
    format: "esm",
    logLevel: "silent",
    plugins: [plugin]
  })
}

// esbuild 扫描插件，这个是重点
function esbuildScanPlugin(
  config: ResolvedConfig,
  container: PluginContainer,
  depImports: Record<string, string>,
  missing: Record<string, string>,
  entries: string[]
): Plugin {

  const seen = new Map<string, string | undefined>()

  const resolve = async (
    id: string,
    importer?: string,
  ) => {
    const key = id + (importer && path.dirname(importer))
    // 如果有缓存，就直接使用缓存
    if (seen.has(key)) {
      return seen.get(key)
    }
    const resolved = await container.resolveId(
      id,
      importer && normalizePath(importer)
    )
    // 缓存解析过的路径，之后可以直接获取
    const res = resolved?.id
    seen.set(key, res)
    return res
  }
  const externalUnlessEntry = ({ path }: { path: string }) => ({
    path,
    external: !entries.includes(path),
  })
  return {
    name: 'vite:dep-scan',
    setup(build) {
      const scripts: Record<string, OnLoadResult> = {}
      // external urls
      build.onResolve({ filter: /^(https?:)?\/\// }, ({ path }) => ({
        path,
        external: true
      }))
      
      build.onResolve({ filter: /\.(css|less|sass|scss|styl|stylus|pcss|postcss|json|wasm)$/ }, ({ path }) => ({
        path,
        external: true
      }))

      // 匹配所有的虚拟模块，namespace 标记为 script
      build.onResolve({ filter: virtualModuleRE }, ({ path }) => {
        return {
          path: path.replace(virtualModulePrefix, ''),
          namespace: 'script',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'script' }, ({ path }) => {
        return scripts[path]
      })
  
      // 处理html
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer)
        if (!resolved) return
          return {
            path: resolved,
            // 标记 namespace 为 html 
            namespace: 'html'
          }
      })

      build.onLoad({filter: htmlTypesRE, namespace: 'html'}, async ({path}) => {
        //  ------- /Users/kwai/Documents/me/vue-ecology/playground/index.html
        //  ------- /Users/kwai/Documents/me/vue-ecology/playground/src/App.vue
        let raw = await fsp.readFile(path, 'utf-8')
        // 重置正则表达式的索引位置，因为同一个正则表达式对象，每次匹配后，lastIndex 都会改变
        // regex 会被重复使用，每次都需要重置为 0，代表从第 0 个字符开始正则匹配
        scriptRE.lastIndex = 0
        let js = ''
        let scriptId = 0
        let match: RegExpExecArray | null
        // 匹配源码的 script 标签，用 while 循环，因为 html 可能有多个 script 标签
        while ((match = scriptRE.exec(raw))) {
          // ["<script type=\"module\" src=\"./src/main.js\"></script>","<script type=\"module\" src=\"./src/main.js\">",""]
          // content: script 标签的内容
          const [, openTag, content] = match
          // 正则匹配出 script src 属性
          const srcMatch = openTag.match(srcRE)
          // 有 src 属性，证明是外部 script
          if (srcMatch) {
            const src = srcMatch[1] || srcMatch[2] || srcMatch[3]
            js += `import ${JSON.stringify(src)}\n`
          } else if (content.trim()) {
            const key = `${path}?id=${scriptId++}`
            scripts[key] = {
              loader: 'js',
              contents: content,
            }
            // 虚拟模块的路径，如 virtual-module:D:/project/index.html?id=0
            const virtualModulePath = JSON.stringify(virtualModulePrefix + key)
            js += `export * from ${virtualModulePath}\n`
          }
        }
        if (!path.endsWith('.vue') || !js.includes('export default')) {
          js += '\nexport default {}'
        }
        return {
          loader: 'js',
          contents: js,
        }
      })

      // 第一个字符串为字母或 @，且第二个字符串不是 : 冒号。如 vite、@vite/plugin-vue
      // 目的是：避免匹配 window 路径，如 D:/xxx 
      build.onResolve({ filter: /^[\w@][^:]/ }, async ({path: id, importer}) => {
    
        // 将模块路径转换成真实路径，实际上调用 container.resolveId
        const resolved = await resolve(id, importer)
        if (depImports[id]) {
          return externalUnlessEntry({ path: id })
        }
        if (resolved) {
          if (shouldExternalizeDep(resolved, id)) {
            return externalUnlessEntry({ path: id })
          }
            // 如果模块在 node_modules 中，则记录 bare import
          if (resolved.includes('node_modules')) {
            // 记录 bare import
            depImports[id] = resolved
            return externalUnlessEntry({ path: id })
          }
        } else {
          // 解析不到依赖，则记录缺少的依赖
          missing[id] = normalizePath(importer)
        }
      })

      // catch all -------------------------------------------------------------
      // 处理解析路径
      build.onResolve({ filter: /.*/ }, async ({ path: id, importer }) => {
        const resolved = await resolve(id, importer)
        if (resolved) {
          const namespace = htmlTypesRE.test(resolved) ? 'html' : undefined
           return {
              path: path.resolve(resolved),
              namespace,
            }
        }
         return externalUnlessEntry({ path: id })
      })
    }
  }
}