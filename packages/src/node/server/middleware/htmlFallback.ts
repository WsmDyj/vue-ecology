/*
 * @Author: wusimin wusimin@kuaishou.com
 * @Date: 2024-04-12 14:03:22
 * @LastEditors: wusimin wusimin@kuaishou.com
 * @LastEditTime: 2024-04-12 14:35:17
 * @FilePath: /vue-ecology/packages/src/node/server/middleware/htmlFallback.ts
 * @Description: 路径重写
 */
import type { NextHandleFunction } from "connect"
import type { ViteDevServer } from "../../server"

import history, { Context } from 'connect-history-api-fallback'

export function htmlFallbackMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const historyHtmlFallbackMiddleware = history({
      rewrites: [
        {
          from: /\/$/,
          to(context: Context) {
            if (context?.parsedUrl?.pathname) {
              const rewritten = decodeURIComponent(context?.parsedUrl?.pathname) + 'index.html'
              return rewritten
            }
            return ''
          },
        },
      ],
    })
    return historyHtmlFallbackMiddleware(req, res, next)
  } 
}