import path from 'node:path'
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { cleanUrl, isCSSRequest, normalizePath } from "../../utils"
import { readFile } from 'fs/promises'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    let url = cleanUrl(req.url!)
    if (isCSSRequest(url)) {
      const cssPath = normalizePath(path.join(server.config.root, url))
      const cssContent = await readFile(cssPath, 'utf-8')
      const code = [
        `const id = "${url}"`,
        `const __vite__css = ${JSON.stringify(cssContent)}`,
        `updateStyle(id, __vite__css)`,
        `export default __vite__css`
      ].join("\n")

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(code);
    }
    next()
  }
}