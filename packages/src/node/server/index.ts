import connect from "connect";
import { indexHtmlMiddleware } from './middleware/indexHtml'

export interface ViteDevServer {
  root: string
}

export async function createServer(): Promise<ViteDevServer> {
  const app = connect()

  const server = {
    root: process.cwd()
  } 

  app.use(indexHtmlMiddleware(server))

  app.listen(3000, async () => {
    console.log(`> 本地访问路径: "http://localhost:3000"`);
  });

  return server
}