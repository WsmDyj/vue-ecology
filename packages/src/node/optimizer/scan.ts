import glob from "fast-glob"
import { ResolvedConfig } from '../server'
import esbuild from "esbuild"
import type { Plugin } from 'esbuild'

export async function scanImports(config: ResolvedConfig) {
  // 扫描到的依赖，会放到该对象
  const deps: Record<string, string> = {}
  // 缺少的依赖，用于错误提示
  const missing: Record<string, string> = {}
  // 存储所有入口文件的数组
  let entries = await computeEntries(config)
  const esbuildContext = await prepareEsbuildScanner(config, entries, deps, missing, scanContext)
}

function esbuildScanPlugin(
  config: ResolvedConfig,
  depImports: Record<string, string>,
  missing: Record<string, string>,
  entries: string[]
): Plugin {
  const seen = new Map<string, string | undefined>()
  return {
    name: 'vite:dep-scan',
    setup(build) {

    }
  }
}

async function prepareEsbuildScanner(
  config: ResolvedConfig,
  entries: string[],
  deps: Record<string, string>,
  missing: Record<string, string>
) {
  // esbuild 扫描插件，这个是重点！！！
  const plugin = esbuildScanPlugin(config, deps, missing, entries)
  
  await esbuild.context({
    absWorkingDir: process.cwd(),
    write: false,
    bundle: true,
    format: "esm",
    logLevel: "silent",
    plugins: [plugin]
  })
}

// 确定入口文件
async function computeEntries(config: ResolvedConfig) {
  return glob("**/*.html", {
    cwd: config.root,
    ignore: ["**/node_modules/**"],
    absolute: true,
    suppressErrors: true // suppress EACCES errors
  })
}