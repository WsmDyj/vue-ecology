import connect from "connect";

import { transformMiddleware } from './middleware/transform'
import { indexHtmlMiddleware } from './middleware/indexHtml'

import type { PluginContainer } from "./pluginContainer"
import { createPluginContainer } from "./pluginContainer"

export interface ResolvedConfig {
  root: string
}
export interface ViteDevServer {
  config: ResolvedConfig
  pluginContainer: PluginContainer
  listen(): Promise<void>
}


export async function createServer(): Promise<ViteDevServer> {
  const app = connect()

  const config = {
     root: process.cwd(),
  }

  const container = await createPluginContainer(config)

  const server: ViteDevServer = {
    config,
    pluginContainer: container,
    async listen() {
      app.listen(3000, async () => {
        console.log(`> 本地访问路径: "http://localhost:3000"`);
      });
    }
  } 


  app.use(transformMiddleware(server))

  app.use(indexHtmlMiddleware(server))

 
  return server
}
