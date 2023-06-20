# 后台服务
当我们使用 Vite 开发前端应用时，需要经常在本地进行代码编写、调试和测试等工作。这时候，Vite 创建一个本地服务就显得非常必要了。
在开发环境下，Vite 创建本地服务的主要作用有以下几点：

* 提供静态资源服务器：Vite 可以将你的项目文件（例如 HTML、CSS、JavaScript、图片等）托管在本地服务器上，方便你在浏览器中访问和调试。并且控制浏览器请求加载的资源，通过转换和处理成浏览器能加载的目标资源。

* 支持模块热更新：Vite 可以在本地即时编译你的代码，无需手动构建，在不刷新页面的情况下更新你的代码，提高开发效率。这意味着，当你修改了代码后，Vite 可以快速地重新加载模块，并将最新的代码注入到浏览器中，从而实现实时预览。

总之，通过创建本地服务，Vite 可以提供一系列便捷的功能，从而让你更加高效地进行前端开发。

## 创建本地node服务
上一章我们已经搭建完了整个项目框架，在 playground 中运行 `pnpm run dev` 会执行vite dev指令，执行cli文件中 action 方法。在这一节中我们将会丰富这个action启动一个本地服务。

首先新建在node文件夹下新建一个server文件，用于创建我们的本地服务 `packages/src/node/server/index.ts`，内容如下：导出createServer函数返回一个listen方法用于启动服务
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
.action(async () => {
  const { createServer } = await import('./server')
  const server = await createServer()
  await server.listen()
})
```
进入 packages 执行 `pnpm run dev` 启动我们的vite，这时在 playground 下执行dev控制台输出 `启动本地服务`。

## 开启一个 Server
Vite4 中使用 [Connect](https://www.npmjs.com/package/connect) 这个库创建http服务，在开发过程中进行实时的热更新和模块热替换。Connect是一个Node.js的中间件框架，它提供了一种简单的方式来创建HTTP服务器，当一个请求发送到 server时，会经过一个个的中间件，中间件本质是一个回调函数，每次请求都会执行回调。这样我们可以通过中间件的方式分别对请求进行处理，每个中间件只负责特定的事情，并进行响应。这样可以将我们的业务逻辑很好的拆分，并允许开发者使用各种插件来扩展其功能，大大增加了代码的可扩展性和维护性。

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
