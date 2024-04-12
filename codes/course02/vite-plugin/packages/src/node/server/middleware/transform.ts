import path from 'node:path'
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { cleanUrl, isCSSRequest } from "../../utils"

import { transformRequest } from '../transformRequest'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    let url = cleanUrl(req.url!)
    if (isCSSRequest(url)) {
      const result = await transformRequest(url, server)
    }
    next()
  }
}