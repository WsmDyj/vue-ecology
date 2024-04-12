/*
 * @Author: wusimin wusimin@kuaishou.com
 * @Date: 2024-04-12 14:41:04
 * @LastEditors: wusimin wusimin@kuaishou.com
 * @LastEditTime: 2024-04-12 14:55:47
 * @FilePath: /vue-ecology/packages/src/node/server/middleware/static.ts
 * @Description: 处理静态资源加载
 */
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
    const dir = server.config.root
    const serve = sirv(
      dir,
      sirvOptions
    )
    serve(req, res, next)
  }
}