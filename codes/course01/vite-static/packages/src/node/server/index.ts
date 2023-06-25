import connect from "connect"

import { indexHtmlMiddleware, createDevHtmlTransformFn } from './middleware/indexHtml'
import { htmlFallbackMiddleware } from './middleware/htmlFallback'
import { serveStaticMiddleware } from './middleware/static'
import { cssMiddleware } from './middleware/cssTransform'

export interface ResolvedConfig {
  root: string 
}

export interface ViteDevServer {
  config: ResolvedConfig
  listen(): Promise<void>
}
export async function createServer(): Promise<ViteDevServer> {
  // 创建http请求
  const app = connect()

  const config = {
    root: process.cwd() // 定义一个全局root
  }

  const server: ViteDevServer = {
    config,
    async listen() {
      // 启动一个3000端口
      app.listen(3000, async () => {
        console.log(`> 本地访问路径: "http://localhost:3000"`)
      })
    }
  }

  app.use(cssMiddleware(server)) // 资源请求转发

  app.use(serveStaticMiddleware(server)) // 静态资源

  app.use(htmlFallbackMiddleware(server)) // 重定向到index.html

  app.use(indexHtmlMiddleware(server)) // 通过use的方式注册中间并传递参数server作为参数


  return server
}