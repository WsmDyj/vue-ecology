# 什么是后台服务
当我们使用 Vite 开发前端应用时，需要经常在本地进行代码编写、调试和测试等工作。这时候，Vite 创建一个本地服务就显得非常必要了。
在开发环境下，Vite 创建本地服务的主要作用有以下几点：

* 提供静态资源服务器：Vite 可以将你的项目文件（例如 HTML、CSS、JavaScript、图片等）托管在本地服务器上，方便你在浏览器中访问和调试。并且控制浏览器请求加载项目中资源，通过转换和处理成浏览器能加载的目标资源。

* 支持模块热更新：Vite 可以在本地即时编译你的代码，无需手动构建，在不刷新页面的情况下更新你的代码，提高开发效率。这意味着，当你修改了代码后，Vite 可以快速地重新加载模块，并将最新的代码注入到浏览器中，从而实现实时预览。

* 支持代理：Vite Server 支持代理功能，可以将请求转发到其他服务器或接口，从而方便地进行前后端分离开发。

总之，通过创建本地服务，Vite 可以提供一系列便捷的功能，从而让你更加高效地进行前端开发。

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-server](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-server) 


## 创建本地node服务
上一章我们已经搭建完成了整个项目框架，在 playground 中运行 `pnpm run dev` 会执行vite dev指令，执行cli文件中 action 方法。在这一节中我们将会丰富这个action用来启动一个本地服务。

首先在node文件夹下新建一个server文件，用于创建我们的本地服务 `packages/src/node/server/index.ts`，内容如下：导出createServer函数返回一个listen方法用于启动服务
```typescript
export interface ViteDevServer {
  listen(): Promise<void>
}
export async function createServer(): Promise<ViteDevServer> {
  const server: ViteDevServer = {
    async listen() {
      console.log('启动本地服务')
    }
  }
  return server
}
```
替换 `packages/src/node/cli.ts` 中action内容，动态引入server文件并执行listen方法，内容如下：
```typescript
cli
  .action(async () => {
    const { createServer } = await import('./server')
    const server = await createServer()
    await server.listen()
  })
```
进入 packages 执行 `pnpm run dev` 启动我们的vite，这时在 playground 下执行dev启动项目控制台输出 `启动本地服务`。

## 开启一个 Server
Vite4 中使用 [Connect](https://www.npmjs.com/package/connect) 这个库创建http服务，在开发过程中进行实时的热更新和模块热替换。Connect是一个Node.js的中间件框架，它提供了一种简单的方式来创建HTTP服务器，当一个请求发送到 server 时，会经过一个个的中间件，中间件本质是一个回调函数，每次请求都会执行回调。这样我们可以通过中间件的方式分别对请求进行处理，每个中间件只负责特定的事情，并进行响应。这样可以将业务逻辑很好的拆分，并允许开发者使用各种插件来扩展其功能，大大增加了代码的可扩展性和维护性。

<center>
  <ZoomImg src="../../../../public/images/node/connect.webp" />
</center>

在 packages 下安装 connect: `pnpm i connect @types/connect -D`。并在server中引用:
```typescript
import connect from "connect"
export async function createServer(): Promise<ViteDevServer> {
  // 创建http请求
  const app = connect()

  const server: ViteDevServer = {
    async listen() {
      // 启动一个3000端口
      app.listen(3000, async () => {
        console.log(`> 本地访问路径: "http://localhost:3000"`)
      })
    }
  }
  return server
}
```
到这里我们的http server已经开发完成，在浏览器访问输入 `http://localhost:3000` 可以看到服务是正常启动的。

## 加载html
本地服务已经启动，但页面没有加载任何资源，因此我们需要实现当服务启动的时候自动加载项目下的html，首先在 playgroun 下我们可以新建一个 index.html 文件，希望当启动项目执行 `pnpm run dev` 的时候页面可以渲染当前html内容。

联想上文，借助中间件原理，当服务启动的时候根据请求的 `path` 是可以实现自定义不同的处理逻辑。这时候我们可以自定义一个中间件（indexHtmlMiddleware），当请求的地址是 `/` 的时候返回html内容。

新建indexHtml文件 `packages/src/node/server/middleware/indexHtml.ts` 内容如下：
```typescript
import type { NextHandleFunction } from "connect"
import type { ViteDevServer } from "../../server"
import { readFile } from "fs/promises"
import path from "path"

export function indexHtmlMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url
    if (url === "/") { // 匹配跟路径
      const htmlPath = path.resolve(server.config.root, "index.html") // 拿到html地址
      let html = await readFile(htmlPath, "utf-8") // 读取html内容
      res.statusCode = 200
      res.setHeader("Content-Type", "text/html")
      return res.end(html) // 返回html内容
    }
    next()
  }
}
``` 
为了统一配置，在server文件下新增 config 配置，在 vite 中这快config会和用户配置的 vite.config.ts 内容合并，为了更好的理解，将简化这一部分内容，手动自定义一些全局的config。于是在 `packages/src/node/server/index.ts` 中我们新增 config内容，并注册刚写的 `indexHtmlMiddleware` 中间件，内容如下：
```typescript
import { indexHtmlMiddleware } from "./middleware/indexHtml"
export interface ResolvedConfig {
  root: string 
}
export interface ViteDevServer {
  config: ResolvedConfig // 新增全局配置文件
  listen(): Promise<void>
}
export async function createServer(): Promise<ViteDevServer> {
  const config = {
    root: process.cwd() // 定义一个全局root
  }
   const server: ViteDevServer = {
    config,
    // ...其他内容
  }
  app.use(indexHtmlMiddleware(server)) // 通过use的方式注册中间并传递参数server作为参数
  return server
}
```
当我们在playground下，再次启动项目的时候，可以看到页面已经渲染了html内容。