import type { NextHandleFunction } from "connect"
import type { ViteDevServer } from "../../server"
import sirv from 'sirv'
import type { Options } from 'sirv'

const sirvOptions: Options = { // sirv的一些配置
  dev: true,
  etag: true,
  extensions: []
}

export function serveStaticMiddleware(server: ViteDevServer): NextHandleFunction {
  return function viteServeStaticMiddleware(req, res, next) {
    const serve = sirv(
      server.config.root, // 项目根路径
      sirvOptions
    )
    serve(req, res, next)
  }
}