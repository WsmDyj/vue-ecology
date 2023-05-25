import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { isJSRequest } from "../../utils"
import { transformRequest } from '../transformRequest'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next()
    }
    let url = req.url!
    if (isJSRequest(url)) {
      const result = await transformRequest(url, server)
      console.log(result)
    }
    next()
  }
}