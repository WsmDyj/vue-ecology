import path from 'node:path'
import { readFile } from "fs/promises"
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '..'
import { isCSSRequest, cleanUrl, normalizePath } from "../../utils"

export function cssMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    let url = cleanUrl(req.url!)
    if (isCSSRequest(url)) {
      const cssPath = normalizePath(path.join(server.config.root, url))
      const cssContent = await readFile(cssPath, 'utf-8')
      const code = [
        // `import { updateStyle as __vite__updateStyle } from ${JSON.stringify(
        //   path.posix.join(config.base, CLIENT_PUBLIC_PATH),
        // )}`,
        `const id = "${url}"`,
        `const __vite__css = ${JSON.stringify(cssContent)}`,
        `__vite__updateStyle(id, __vite__css)`,
        `export default __vite__css`
      ].join('\n')

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(code);
    }
    next()
  }
}

