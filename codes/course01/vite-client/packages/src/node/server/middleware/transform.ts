import path from 'node:path'
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { isJSRequest, isImportRequest, isCSSRequest, normalizePath } from "../../utils"
import { URL } from 'node:url'
// import { CLIENT_ENTRY } from '../../constants'
// console.log(CLIENT_ENTRY)


export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    // 只处理 GET 请求，其他不处理
    if (req.method !== "GET") {
      return next()
    }
    let url = req.url!

    if (isJSRequest(url) || isImportRequest(url) || isCSSRequest(url)) {
      // const filepath = path.join(server.config.root, url)
      console.log(url)
      // const normalizedClientEntry = normalizePath(CLIENT_ENTRY)
      //  console.log(normalizedClientEntry)
      try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        return res.end('');
      } catch (e) {
        console.log(e)
      }
    }
    next()
  }
}