import type { NextHandleFunction } from "connect"
import type { ViteDevServer } from "../../server"

import history from 'connect-history-api-fallback'

export function htmlFallbackMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const historyHtmlFallbackMiddleware = history({
      rewrites: [
        {
          from: /\/$/,
          to({ parsedUrl }: any) {
            const rewritten = decodeURIComponent(parsedUrl.pathname) + 'index.html'
            return rewritten
          },
        },
      ],
    })
    return historyHtmlFallbackMiddleware(req, res, next)
  } 
}