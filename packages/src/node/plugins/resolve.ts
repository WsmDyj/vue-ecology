import path from 'path'
import { Plugin } from '../plugin'
import { pathExists } from "fs-extra";

export function resolvePlugin(): Plugin {
  return {
    name: 'vite:resolve',
    async resolveId(id, importer) {
     if (id.startsWith(".") || id.includes('main')) {
        const basedir = importer ? path.dirname(importer) : process.cwd()
        const fsPath = path.join(basedir, id)
        return { id: fsPath }
      } else if (path.isAbsolute(id)) {
        return { id };
      }  else {
        // 第三方库
        let prefix = ''
        const basedir = importer ? path.dirname(importer) : process.cwd()
        prefix = path.resolve(basedir, '..', 'node_modules', id)
         if (id.includes('@')) {
          prefix = `/Users/kwai/Documents/me/vue-ecology/playground/node_modules/${id}`
        }
        const module = require(prefix + '/package.json').module
        const fsPath = path.join(prefix, module)
        return { id: fsPath }
      }
    }
  }
}
