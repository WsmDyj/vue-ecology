# 插件化架构
在上一章中我们通过自定义 Connect 中间件的方式，实现了一些基本的功能，例如：静态资源加载、css处理等，但是这些能力都是写死的。如果需要新增功能，比如加载less、vue、ts文件等，就必须得修改中间件 `transform` 的代码或者增加其他的中间件，如果每次将扩展功能的逻辑与核心逻辑混在一起，一来代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护目前。因此 Vite 设计出了一套兼容 Roullp 完整的插件机制，将自身的核心逻辑与插件逻辑分离，提高了 vite 的复用和可扩展性。接下来让我们一起看下 vite 是如何设计插件化的架构。
<center>
  <ZoomImg src="../../../../public/images/node/static04.png" />
</center>

## 什么是插件
插件化架构（Plug-in Architecture），有时候又被成为微内核架构（Microkernel Architecture），是一种面向功能进行拆分的可扩展性架构。微内核架构模式允许你将其他应用程序功能作为插件添加到核心应用程序，从而提供可扩展性以及功能分离和隔离。

举个例子，在 Vue 中通过调用 use() 方法来注册需要使用的插件， use 方法实际上会调用插件的 install 函数加载插件。
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from 'vue-router'

const pinia = createPinia()
const router = createRouter()
const app = createApp({})

app.use(router) // vue-router 插件
app.use(pinia) // pinia 插件
app.mount('#app')
```
通过这种插件化的机制我们可以对 vue 功能进行补充，并且不会影响到 vue 核心代码逻辑。对于 install 函数，一般称为插件的钩子（hook）。我们可以往hook上挂载任何东西，当程序执行到hook的时候，便会执行对应挂载的函数，就好比如vue的生命周期函数（onMounted、onUpdate...）一样。
## Rollup 插件
我们知道 Vite 在生产环境中通过 Rollup 对整个项目进行打包，沿用 Rollup 设计的一套完整的插件机制。 Rollup 插件是一个具有下面描述的一个或多个属性、构建钩子和输出生成钩子的对象，它遵循我们的约定。一个插件应该作为一个包来分发，该包导出一个可以用插件特定选项调用的函数，并返回这样一个对象。插件允许你定制 Rollup 的行为，例如，在捆绑之前编译代码，或者在你的 node_modules 文件夹中找到第三方模块。

简单来说，rollup 的插件是一个普通的函数，函数返回一个对象，该对象包含一些属性(如 name)，和不同阶段的钩子函数(构建 build 和输出 output 阶段)