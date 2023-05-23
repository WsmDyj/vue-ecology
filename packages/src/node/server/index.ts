import connect from "connect";
import { indexHtmlMiddleware } from './middleware/indexHtml'
import { createPluginContainer } from "./pluginContainer"

export interface ViteDevServer {
  root: string
}

export async function createServer(): Promise<ViteDevServer> {
  const app = connect()

  const server = {
    root: process.cwd()
  } 

  app.use(indexHtmlMiddleware(server))

  const container = await createPluginContainer()

  app.listen(3000, async () => {
    console.log(`> 本地访问路径: "http://localhost:3000"`);
  });

  return server
}