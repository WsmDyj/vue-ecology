import connect from "connect";

import { initDepsOptimizer } from '../optimizer'

import { transformMiddleware } from './middleware/transform'
import { indexHtmlMiddleware } from './middleware/indexHtml'

import type { PluginContainer } from "./pluginContainer"
import { createPluginContainer } from "./pluginContainer"

export interface ResolvedConfig {
  root: string
  cacheDir: string
}
export interface ViteDevServer {
  config: ResolvedConfig
  pluginContainer: PluginContainer
  listen(): Promise<void>
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
      // 依赖构建
      await initDepsOptimizer(config)
      // 启动项目
      app.listen(3000, async () => {
        console.log(`> 本地访问路径: "http://localhost:3000"`);
      });
    }
  } 


  // 文件内容的转化
  app.use(transformMiddleware(server))

  app.use(indexHtmlMiddleware(server))

 
  return server
}
