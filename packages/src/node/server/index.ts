import connect from "connect";

import { transformMiddleware } from './middleware/transform'
import { indexHtmlMiddleware } from './middleware/indexHtml'

import type { PluginContainer } from "./pluginContainer"
import { createPluginContainer } from "./pluginContainer"

export interface ViteDevServer {
  root: string
  pluginContainer: PluginContainer
}

export async function createServer(): Promise<ViteDevServer> {
  const app = connect()

    const container = await createPluginContainer()

  const server = {
    root: process.cwd(),
    pluginContainer: container
  } 


  app.use(transformMiddleware(server))
  app.use(indexHtmlMiddleware(server))



  app.listen(3000, async () => {
    console.log(`> 本地访问路径: "http://localhost:3000"`);
  });

  return server
}