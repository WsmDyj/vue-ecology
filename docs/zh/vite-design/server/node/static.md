# 页面资源加载
在上一章节中讲到通过 Connect 启动后台服务，设计了中间件 `indexHtmlMiddleware` 根据匹配规则加载Html内容并在浏览器中渲染。之前 html body 只有h1标签，并没有什么问题。这时如果在html中引用一些静态资源，那么会出现什么问题呢？

<center>
  <ZoomImg src="../../../../public/images/node/static01.png" />
</center>

从图中可以看出当引用一些静态资源时会出现404，因为后台服务并没有去处理这些静态资源的引入。因此我们需要再设计一个中间件去单独加载这些静态资源。

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-static](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite-static) 

## 静态资源加载
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
最后在server下注册这个中间件 `app.use(serveStaticMiddleware(server))`，启动 playground 项目时可以看到html中的静态资源已经全部加载完成。

<center>
  <ZoomImg src="../../../../public/images/node/static02.png" />
</center>

## 加载css资源
上文中在html中通过link的方式引入 `/src/assets/normalize.css` 样式，但是实际在项目中一般会通过 import 的方式引入css资源，如下：
```ts
// main.js文件
import './assets/normalize.css'
console.log('i am main.js')
```
对于 import 这种方式的引入，浏览器直接报错了：
 <font color=red>Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/css". </font>

 这是因为加载 `normalize.css` 文件我们希望 request.headers.accept 是 text/css 类型，但是浏览器会把css文件当作JavaScript类型去加载，那么我们应该如何去加载项目中通过import引用的css呢?

 可以先回忆一下，在html中引入css的方式也可以在 head 中通过style标签的方式：
 ```js
 <style type="text/css">
    img {
      width: 50px;
      height: 50px;
    }
  </style>
 ```
因此可以把import引入的css转换成通过style的方式引入，可以分为以下几个步骤：
* 获取import css后面的路径
* 根据路径读取css文件内容
* 动态创建style标签将读取的css文件内容插入其中

## 进阶
对于上述的步骤，我们可以把所有的逻辑封装到一个中间件中，在 packages 下创建 `packages/src/node/server/middleware/transform.ts` 中间件，内容如下:
```typescript
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    // 具体业务逻辑
  }
}
```
首先我们在utils中先定义三个方式，匹配css正则 `isCSSRequest`、路径兼容window系统 `normalizePath`、去除url参数 `cleanUrl`:
```typescript
// utils.ts 

// css正则匹配
const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
export const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)

// 去除url的参数 /cac/test?query=da -> /cac/test
export function cleanUrl(url: string): string {
  return url.replace(/[?#].*$/s, "")
}

// 路径兼容window系统
export const isWindows = os.platform() === 'win32'
export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
```
接着可以在transform中引用这几个方法，用于解析匹配css文件路径，并读取内容
```typescript
import path from 'node:path'
import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { cleanUrl, isCSSRequest, normalizePath } from "../../utils"
import { readFile } from 'fs/promises'

export function transformMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    let url = cleanUrl(req.url!)
    if (isCSSRequest(url)) {
      const cssPath = normalizePath(path.join(server.config.root, url)) // 获取css路径
      const cssContent = await readFile(cssPath, 'utf-8') // 读取css内容
      const code = [
        `const id = "${url}"`,
        `const __vite__css = ${JSON.stringify(cssContent)}`,
        `updateStyle(id, __vite__css)`,
        `export default __vite__css`
      ].join("\n")

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(code); // 返回编译好的code
    }
    next()
  }
}
```
至此我们已经完了前两步，最后只需完善 updateStyle 方法：动态创建style标签将读取的css文件插入其中。由于这个方法会一直重复使用，我们需要把这个方法写到全局，所以在html通过script的方式注入，内容如下：
```js
<script>
  function updateStyle (id, content) {
    const style = document.createElement('style') // 动态创建style标签
    style.setAttribute('type', 'text/css')
    style.setAttribute('data-vite-dev-id', id)
    style.textContent = content // 设置读取的css内容
    document.head.appendChild(style) // 将style标签插入到html的head中
  }
</script>
```
在 `packages/src/node/server/index.ts` 注册 transfrom 中间件，注意中间件注册的顺序 `app.use(transformMiddleware(server))` ，当启动项目的时候可以看到 normalize.css 已经通过js的方式加载进来。
<center>
  <ZoomImg src="../../../../public/images/node/static03.png" />
</center>

## 总结
在这一章节中，我们开发了 static 中间件通过借助 sirv 这个库的能力，用于加载静态资源。这时，如果项目中不是通过静态方式加载的资源，比如css通过import的方式引入，也会当成js请求去加载，因此我们开发了 transform 中间件先通过正则的方式匹配出所有请求为css资源的url，读取这个url路径下的文件并动态创建style标签，将css文件内容写入到style标签下并返回给浏览器，用于加载css资源。

