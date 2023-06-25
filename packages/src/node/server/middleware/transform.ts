import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { isJSRequest, isImportRequest, isCSSRequest } from "../../utils"

import { transformRequest } from '../transformRequest'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    // 只处理 GET 请求，其他不处理
    if (req.method !== "GET") {
      return next()
    }
    let url = req.url!

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