import path from "path"
import type { NextHandleFunction } from "../../../../../../../course02/vite-plugin/playground/node_modules/.pnpm/@types+connect@3.4.35/node_modules/@types/connect"
import type { ViteDevServer } from "../../server"
import { readFile } from "fs/promises"

export function indexHtmlMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url
    if (url?.endsWith('.html')) {
      const htmlPath = path.resolve(server.config.root, "index.html") // 拿到html地址
      let html = await readFile(htmlPath, "utf-8") // 读取html内容
      res.statusCode = 200
      res.setHeader("Content-Type", "text/html")
      return res.end(html) // 返回html内容
    }
    next()
  }
}

