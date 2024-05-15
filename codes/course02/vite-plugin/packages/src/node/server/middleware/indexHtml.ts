import path from "path"
import type { NextHandleFunction } from "connect"
import type { ViteDevServer } from ".."
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

