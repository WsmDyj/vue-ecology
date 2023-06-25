# 静态资源加载
在上一章节中讲到通过 Connect 启动后台服务，设计了中间件 `indexHtmlMiddleware` 根据匹配规则加载Html内容并在浏览器中渲染。之前 html body 只有h1标签，并没有什么问题。这时如果在html中引用一些静态资源，那么会出现什么问题呢？

<center>
  <ZoomImg src="../../../../public/images/node/static01.png" />
</center>

从图中可以看出当引用一些静态资源时会出现404，因为后台服务并没有去处理这些静态资源的引入。因此我们需要再设计一个中间件去单独加载这些静态资源。

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-static](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-static) 

## static中间件
vite 处理静态资源引用依赖的是 [sirv](https://www.npmjs.com/package/sirv) 这个库，大致作用是用来处理静态资源请求，快速且轻量级的serve-static替代品。在 packages 下安装这个依赖 `pnpm i sirv -D`，并新建 `packages/src/node/server/middleware/static.ts` 中间件，内容如下：
```typescript
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
    const serve = sirv(
      server.config.root, // 项目根路径，在vite中 public 目录可以通过 publicDir 选项 来配置
      sirvOptions
    )
    serve(req, res, next)
  }
}
```
最后在server下注册这个中间件 `app.use(serveStaticMiddleware(server))`，启动 playground 项目时可以看到html中的静态资源已经全部加载完成了。

<center>
  <ZoomImg src="../../../../public/images/node/static02.png" />
</center>

## 进阶
上文中在html中通过link的方式引入 `/src/assets/normalize.css` 样式，但是我们一般会在 Vue、React 项目中的入口文件（main.js）通过import的方式引入css，如下：
```ts
// main.js文件
import './assets/normalize.css'
console.log('i am main.js')
```
对于这种方式的引入，浏览器直接报错了：
 <font color=red>Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/css". </font>

 这是因为加载 `normalize.css` 文件我们希望 request.headers.accept 是 text/css 类型，但是浏览器把css文件也会当作JavaScript类型去加载，那么我们应该如何去加载项目中通过import引用的css呢?。

 可以先回忆一下，在html中引入css的方式也可以在 head中 通过style标签的方式：
 ```js
 <style type="text/css">
    img {
      width: 50px;
      height: 50px;
    }
  </style>
 ```
因此我们可以把import引入的css通过style的方式进行转换，过程大致如下：
* 获取import css后面的路径
* 根据路径读取css文件
* 动态创建style标签将读取的css文件插入其中