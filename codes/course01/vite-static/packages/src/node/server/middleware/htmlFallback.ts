import type { NextHandleFunction } from "../../../../../../../course02/vite-plugin/playground/node_modules/.pnpm/@types+connect@3.4.35/node_modules/@types/connect"
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