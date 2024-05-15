import path from 'node:path'
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '..'
import { cleanUrl, isCSSRequest, isImportRequest, isJSRequest, normalizePath } from "../../utils"
import { readFile } from 'fs/promises'
import { transformRequest } from '../transformRequest'

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
    if (isJSRequest(url) || isImportRequest(url) || isCSSRequest(url)) {
      try {
        const result = await transformRequest(url, server)
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        return res.end(result.code);
      } catch (e) {
        console.log(e)
      }
    }
    next()
  }
}