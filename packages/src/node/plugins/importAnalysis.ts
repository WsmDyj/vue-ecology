import { init, parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import { Plugin } from '../plugin'
import { normalizePath } from '../utils'
import path from 'path'
import { ResolvedConfig } from '../server/index'

// n 表示模块的名称
// s 表示模块名称在导入语句中的开始位置
// e 表示模块名称在导入语句中的结束位置
// ss 表示导入语句在源代码中的开始位置
// se 表示导入语句在源代码中的结束位置
// d 表示导入语句是否为动态导入，如果是则为对应的开始位置，否则默认为 -1
// [
//   { n: 'vue', s: 27, e: 30, ss: 0, se: 31, d: -1, a: -1 },
//   { n: './App.vue', s: 49, e: 58, ss: 32, se: 59, d: -1, a: -1 },
//   { n: './index.css', s: 68, e: 79, ss: 60, se: 80, d: -1, a: -1 }
// ]

export function importAnalysisPlugin(config: ResolvedConfig): Plugin {
  const {root, cacheDir} = config
  return {
    name: 'vite:import-analysis',
    async transform(source, importer) {
      let s = new MagicString(source)
      await init
      const [imports, exports] = parseImports(source) 

      const normalizeUrl = async (url: string, pos: number) => {
         const resolved = await (this as any).resolve(url, importer);
          if (resolved.id.startsWith(root + '/')) {
            url = resolved.id.slice(root.length)
          }
         return [url, resolved.id]
      }
      await Promise.all(imports.map(async (importSpecifier, index) => {
        const {
          n: specifier,
          s: start,
          e: end,
        } = importSpecifier
        
         if (specifier) {
            const [url, resolvedId] = await normalizeUrl(specifier, start)
            s.overwrite(start, end, url)
         }
      }))
      return { code: s.toString() }
    }
  }
}