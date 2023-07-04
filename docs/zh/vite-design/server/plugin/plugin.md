# 插件化架构
在上一章中我们通过自定义 Connect 中间件的方式，实现了一些基本的功能，例如：静态资源加载、css处理等，但是这些能力都是写死的。如果需要新增功能，比如加载less、vue、ts文件等，就必须得修改中间件 `transform` 的代码或者增加其他的中间件，这样一来代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。另一方面这类代码通过 Connect 中间件的实现的方式，在生产环境打包过程中也是无法再次使用的。 因此 Vite 设计出了一套兼容 Roullp 完整的插件机制，将开发环境与生产环境打通，提高了 vite 处理资源和打包的复用与扩展性。下面让我们一起看下 vite 是如何设计插件化的架构。
<center>
  <ZoomImg src="../../../../public/images/node/static04.png" />
</center>

## 什么是插件化架构
插件化架构（Plug-in Architecture），有时候又被成为微内核架构（Microkernel Architecture），是一种面向功能进行拆分的可扩展性架构。微内核架构模式允许你将其他应用程序功能作为插件添加到核心应用程序，从而提供可扩展性以及功能分离和隔离。

<center>
  <ZoomImg src="../../../../public/images/plugin/plugin01.jpeg" />
</center>

图中 Core System 的功能相对稳定，不会因为业务功能扩展而不断修改，而插件模块是可以根据实际业务功能的需要不断地调整或扩展。微内核架构的本质就是将可能需要不断变化的部分封装在插件中，从而达到快速灵活扩展的目的，而又不影响整体系统的稳定。

举个例子，在 Vue 中通过调用 use() 方法来注册需要使用的插件， use 方法实际上会调用插件内部 install 函数加载插件。
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from 'vue-router'

const pinia = createPinia()
const router = createRouter()
const app = createApp()

app.use(router) // vue-router 插件
app.use(pinia) // pinia 插件
app.mount('#app')
```
通过这种插件化的机制我们可以对 vue 功能进行补充，并且不会影响到 vue 核心代码逻辑，极大的提高了vue的扩展性。

## 插件化架构二要素
设计一个比较完备的插件化架构，需要考虑这二大要素：**插件管理**、**插件通讯**。

插件管理简单来说就是核心系统（core）需要实现的功能，提供一套插件注册、加载的机制。通过这套机制可以告诉用户如何注册插件，插件加载的时机以及插件执行的方式。

比如上文的例子中：
* vue使用 `use` 的方式，注册需要使用的插件
* 当vue初始化并启动的时候会立即加载这些插件
* 插件加载之后会调用插件内部 `install` 方法

这个过程就是在vue中实现，通过这一过程我们可以很清楚的知道如何去开发vue插件实现更多功能，并且不需要直接修改vue源码。

有了插件管理的机制，我们只需要往 `install` 挂载代码，当程序执行到hook的时候，便会加载这些插件逻辑。像 `install` 这样的函数，我们一般称为插件钩子（hook），在大型的项目中比如webpack，hook是非常多的。

这是会遇到一个问题，如果一套插件化架构只是提供一些hook（钩子函数）执行用户挂载的业务逻辑，无法实现通信，那么往往是无法对核心系统进行扩展。对于通信关键一点我们需要拿到核心系统（core）的上下文环境，通过上下文环境进行插件和核心系统(core)的通信。看下在vue中是如何通信的：
```js
export default {
  install: (app, options) => {
    // 添加全局方法或 property
    app.myGlobalMethod = function () {
      // 逻辑...
    }
  }
}
```
在 `install` 方法中，提供了 app 参数，用于让插件能够获取到 Vue 实例，这就起到了连接的作用。通过app实例我们可以添加全局方法，或者注册指令等。这就是插件与核心系统的通信。
## 进阶 Rollup 插件
我们知道 Vite 在生产环境中通过 Rollup 对整个项目进行打包，沿用 Rollup 设计的一套完整的插件机制。 Rollup 插件是一个具有下面描述的一个或多个属性、构建钩子和输出生成钩子的对象，它遵循我们的约定。一个插件应该作为一个包来分发，该包导出一个可以用插件特定选项调用的函数，并返回这样一个对象。插件允许你定制 Rollup 的行为，例如，在捆绑之前编译代码，或者在你的 node_modules 文件夹中找到第三方模块。

简单来说，rollup 的插件是一个普通的函数，函数返回一个对象，该对象包含一些属性(如 name)，和不同阶段的钩子函数(构建 build 和输出 output 阶段)