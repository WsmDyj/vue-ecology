# Vite 插件机制
上一节我们学会了 Rollup 构建工具的使用，相信你已经对 Rollup 的基础概念和使用有了基本的掌握。在vite中也是沿用了Rollup的设计思路，自定义了一整套插件机制。

首先，让我们来看一个问题：

在 main.js 中引入 npm 安装的 lodash 库，并且调用它的get方法：
```js
// playground/src/main.js
import './assets/normalize.css'
import get from '../node_modules/lodash-es/get.js'
const a = get({a: '1'}, 'a')
console.log(a)
```
控制台可以看到打印出来的结果，但是在项目中并不会这样引用第三方库，而是直接 

```js
import { get } form 'lodash-es'
```

我们不妨也可以把lodash引入的方式修改为这样，但是你会发现我们的程序报错了：
<center>
  <ZoomImg src="../../../../public/images/plugin/plugin04.png" />
</center>

这是因为在js中相对引用必须以“/”、“./”或“../”开头，这时就需要重写整个项目中第三方库引用的地址，让其自动指向node_modules。要是把这些场景的处理逻辑与核心的打包逻辑都写到一起，一来打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此需要设计一个插件系统，将自身的核心逻辑与插件逻辑分离。这一节中我们一起来设计下vite插件机制。

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/vite-plugin](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/vite-plugin) 

## 插件机制开发
Vite 在内部大量使用 Rollup 来实现其核心功能，其插件系统也是基于 Rollup 的插件系统进行扩展和定制的。因此 Vite 插件可以利用 Rollup 提供的各种 hook 来实现所需的功能。

在上一章节中介绍了 Rollup 的 build 阶段主要会经过 resolveId，load，transform 三个钩子函数。要自定义插件系统，因为需要去实现这三个钩子函数，在项目中新建 src/node/server/pluginContainer.ts文件:
```ts
import type {
  PartialResolvedId,
  LoadResult,
  SourceDescription,
} from "rollup"
import { resolvePlugins } from "../plugin"
export interface PluginContainer {
  name?: string
  resolveId(id: string, importer?: string): Promise<PartialResolvedId>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription>
}
// =======插件机制 =======
export async function createPluginContainer(): Promise<PluginContainer> {
  const plugins = await resolvePlugins(config)
  // 用于绑定当前上下文环境
  class Context {}
  const container: PluginContainer = {
    async resolveId() {},
    async load() {},
    async transform() {}
  }
  return container
}
```

接下来我们需要分别去实现这三个钩子函数：
```js
const container: PluginContainer = {
  async resolveId(rawId, importer = join(config.root, 'index.html')) {
    const ctx = new Context()
    let id: string | null = null
    const partial: Partial<PartialResolvedId> = {}
    for (const plugin of plugins) {
      if (!plugin.resolveId) continue
      const result = await plugin.resolveId.call(ctx, rawId, importer)
      if (!result) continue
      if (typeof result === 'string') {
        id = result
      } else {
        id = result.id
        Object.assign(partial, result)
      }
    }
    if (id) {
      partial.id = id
    }
    return partial as PartialResolvedId
  },
  async load(id) {
    const ctx = new Context()
    for (const plugin of plugins) {
      if (!plugin.load) continue
      const result = await plugin.load.call(ctx, id)
      if (result !== null) {
        return result
      }
    }
    return null
  },
  async transform(code, id) {
    const ctx = new Context()
    for (const plugin of plugins) {
      if (!plugin.transform) continue
      const result = await plugin.transform.call(ctx, code, id)
      if (!result) continue
      if (typeof result === "string") {
        code = result;
      } else if (result.code) {
        code = result.code;
      }
    }
    return { code }
  }
}
return container
```
PluginContainer这里实现的比较简单，主要是通过遍历 resolvePlugins 中注册的插件，依次调用各插件的 resolveId、load、transform 三个事件。

## 如何运行
在初始化createServer()中，我们会使用 app.use(transformMiddleware(server)) 进行文件内容的转发
```js
async function createServer(inlineConfig = {}) {
  const app = connect();   
  app.use(transformMiddleware(server));
}
```
因此我们在这个中间件中去执行container的方法的调用，为什么在transformMiddleware的原因有两点：
1. 对于esmodule，不支持import xx from "vue"这种导入的，需要转化为相对路径或者绝对路径的形式
2. 浏览器只认识js，不支持其它后缀的文件名称，比如.vue、.ts，需要进行处理

在项目中新建 src/node/server/transformRequest.ts文件:
```js
import { ViteDevServer } from './index'

export function transformRequest(url: string, server: ViteDevServer) {
  const request = doTransform(url, server)
  return request
}

async function doTransform(url: string, server: ViteDevServer) {
  const { pluginContainer } = server
  // 解析路径
  const id = (await pluginContainer.resolveId(url))?.id ?? url
  const result = loadAndTransform(id, url, server)
  return result
}

async function loadAndTransform(id: string, url: string, server: ViteDevServer) {
  let code: string | null = null
  const { pluginContainer } = server
  // 读取文件内容
  const loadResult = await pluginContainer.load(id)
  if (loadResult && typeof loadResult === 'object') {
    code = loadResult?.code
  } else {
    code = loadResult ?? ''
  }
  // 转化文件内容
  const transformResult = await pluginContainer.transform(code, id)
  code = transformResult.code
  return {
    code
  }
}
```
接下来我们只需要在transformMiddleware中调用transformRequest即可
```js
// src/node/server/middleware/transform.ts
if (isJSRequest(url) || isImportRequest(url) || isCSSRequest(url)) {
  try {
    const result = await transformRequest(url, server)
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/javascript");
    return res.end(result.code);
  } catch (e) {
    console.log(e)
  }
}
```
到这里vite简化版的插件机制基本实现了,后面只需要填充
## 小结
<center>
  <ZoomImg src="../../../../public/images/plugin/plugin05.png" />
</center>
Vite 在启动时会自动加载注册createPluginContainer，当浏览器启动文件时，会触发transformMiddleware进行资源请求的转化，调用transformRequest方法，依次执行插件中hook。

Vite 之所以要自定义 Rollup 的插件机制,主要有以下几个原因:
1. 性能优化:Rollup 作为一个通用的打包工具,其插件机制是为了满足各种不同的使用场景。但在开发服务器场景下,Rollup 的插件机制可能会带来一些性能开销。Vite 针对开发环境进行了优化,设计了自己的插件机制,以提高开发时的性能。
2. 更好的集成: 作为一个前端开发工具,需要与其他前端生态进行良好的集成,比如支持 Vue、React 等主流框架。Vite 的自定义插件机制使得它能更好地与这些框架的特性进行融合。
3. 更灵活的扩展性:Rollup 的插件机制是通用的,可能无法满足 Vite 在开发、构建等场景下的个性化需求。Vite 自定义的插件机制赋予了它更强的灵活性和可扩展性。
4. 更好的开发体验: 自定义的插件机制使得 Vite 的插件开发和集成更加简单易用,从而提升了整体的开发体验。

总的来说, Vite 自定义 Rollup 插件机制的主要目的是为了更好地适配前端开发场景,提高性能和开发体验,并实现与主流框架的深度集成。这种定制化的设计使得 Vite 能够更好地满足现代前端开发的需求。
