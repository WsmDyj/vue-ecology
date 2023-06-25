import path from 'path'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../server/index'

export const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/

// 根据目前路径的类型，比如是绝对路径、相对路径、模块路或者其他路径类型，然后进行不同的处理，最终返回拼凑好的完整路径
export function resolvePlugin(resolveOptions: ResolvedConfig): Plugin {
  return {
    name: 'vite:resolve',
    async resolveId(id, importer) {
      const { root } = resolveOptions

      if (id[0] === '/' && !id.startsWith(root)) {
        const fsPath = path.resolve(root, id.slice(1))
        return { id: fsPath }
      }

      if (id.startsWith('.')) {
        const basedir = importer ? path.dirname(importer) : process.cwd()
        const fsPath = path.join(basedir, id)
        return { id: fsPath }
      }

      if (path.isAbsolute(id)) {
        return { id };
      }

      // 第三方库
      if (bareImportRE.test(id)) {
        let prefix = path.resolve(root, 'node_modules', id)
        const module = require(prefix + '/package.json').module
        const fsPath = path.join(prefix, module)
        return { id: fsPath }
      }
      return null
    }
  }
}

