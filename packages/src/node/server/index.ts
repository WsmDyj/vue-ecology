import connect from "connect";

import { initDepsOptimizer } from '../optimizer'

import { transformMiddleware } from './middleware/transform'
import { indexHtmlMiddleware } from './middleware/indexHtml'
import { htmlFallbackMiddleware } from "./middleware/htmlFallback";
import { serveStaticMiddleware } from "./middleware/static";

import type { PluginContainer } from "./pluginContainer"
import { createPluginContainer } from "./pluginContainer"


export interface ResolvedConfig {
  root: string
  cacheDir: string
}
export interface ViteDevServer {
  config: ResolvedConfig
  pluginContainer: PluginContainer
  listen(port?: number, isRestart?: boolean): Promise<void>
}


export async function createServer(): Promise<ViteDevServer> {
  
  // 创建http请求
  const app = connect()

  const config = {
    root: process.cwd(),
    cacheDir: 'node_modules/.vite'
  }

  // const moduleGraph = new ModuleGraph((url) =>
  //   container.resolveId(url, undefined),
  // )

  const container = await createPluginContainer(config)

  const server: ViteDevServer = {
    config,
    pluginContainer: container,

    async listen() {
      // 依赖预构建
      // await initDepsOptimizer(config)
      // 启动项目
      app.listen(3000, async () => {
        console.log(`> 本地访问路径: "http://localhost:3000"`);
      });
    }
  } 

  app.use(transformMiddleware(server)) // 资源请求转发

  app.use(serveStaticMiddleware(server)) // 加载静态资源

  app.use(htmlFallbackMiddleware(server)) // 重定向到index.html

  app.use(indexHtmlMiddleware(server)) // 通过use的方式注册中间件并传递参数server作为参数

 
  return server
}
