# vite的本质
Vite，一个基于浏览器原生 **ES imports** 的前端构建工具。利用浏览器去解析 imports，在服务器端按需编译返回。通过在 script 标签中设置 `type="module"`，浏览器会识别这种标签，并对该标签中所有的import关键字，会发起http请求获取模块内容，从而做到加载页面内容，完全跳过了打包这个概念。
<!-- 
![](https://pic3.zhimg.com/80/v2-be21ccda836ca3ff547af801b3fae9f2_1440w.webp)
![](https://pic1.zhimg.com/80/v2-88b66eb443afbbb47081b99447c3f744_1440w.webp) -->
## 现在工程化的痛点
现在前端开发项目，工程化工具已经成为了标准配置，顶流工具应该还是当属 webpack，它可以帮助我们完成从代码开发到打包的全过程。

webpack 的核心原理就是通过分析 JavaScript 中的 require 语句，分析出当前 JavaScript 文件所有的依赖文件，然后递归分析之后，就得到了整个项目的一个依赖图。对图中不同格式的文件执行不同的 loader，比如会把 CSS 文件解析成加载 CSS 标签的 JavaScript 代码，最后基于这个依赖图获取所有的文件。

进行打包处理之后，放在内存中提供给浏览器使用，然后 dev-server 会启动一个测试服务器打开页面，并且在代码文件修改之后可以通过 WebSocket 通知前端自动更新页面，也就是我们熟悉的 `热更新` 功能。


但是随着项目规模的爆炸式增长，webpack 也带来了一些**痛点问题**。

由于 webpack 在项目调试之前，要把所有文件的依赖关系收集完，打包处理后才能启动测试，很多大项目我们执行调试命令后需要等 1 分钟以上才能开始调试。这对于开发者来说，这段时间除了摸鱼什么都干不了，而且热更新也需要等几秒钟才能生效，极大地影响了我们开发的效率。所以针对 webpack 这种打包 bundle 的思路，社区就诞生了 bundless 的框架，Vite 就是其中的佼佼者。

## 什么是ES Module
ES6 Module 也被称作 **ES Module(或 ESM)**，在代码中通过定义 `export、import` 用于对模块的导出或者导入。
如果在 HTML 中加入含有 type="module" 属性的 script 标签，浏览器会按照 ES Module 规范来进行依赖加载和模块解析。在开发环境下就不在需要处理打包的概念，直接交给浏览器进行解析，这也是 Vite 在开发阶段实现 no-bundle 的原因。

ESM的执行可以分为三个步骤：

* 构建: 根据入口文件，找出模块的所有依赖，确定从哪里下载该模块文件、下载并将所有的文件解析为模块记录
* 实例化: 将模块记录转换为一个模块实例，为所有的模块分配内存空间，依照导出、导入语句把模块指向对应的内存地址。
* 运行：运行代码，将内存空间填充

可以看出，ESM使用实时绑定的模式，导出和导入的模块都指向相同的内存地址，也就是值引用。那么什么是 es module 
呢？下面通过一个简单的例子一起来了解下:

首先我们先声明一个html，通过script标签引入 main.js
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module" src="./main.js"></script>
</body>
</html>
```
在 main.js 中导入一个模块（module）的 print 函数，并执行 print
```js
import print from "./module.js"
print()
```
接着在 module.js 实现 print 函数，并使用 export 导出
```js
export default function print() {
  console.log('hello ES Module')
}
```
通过 [live-server](https://www.freecodecamp.org/chinese/news/vscode-live-server-auto-refresh-browser/) 启动html，在控制台可以看到打印的 `hello ES Module`

## 总结
通过上面的例子，我们可以看出当使用 es module 导入导出的模块是会被浏览器直接加载，其实 vite 也是利用了这一点。从官网的介绍图中可以看出，vite 会启动一个服务器，拦截由浏览器请求 ESM 的请求，通过请求的路径找到目录下对应的文件做一定的处理最终以 ESM 的格式返回给客户端，对于静态资源也能做到动态去加载所需要的模块。

![vite-png](https://pic3.zhimg.com/80/v2-be21ccda836ca3ff547af801b3fae9f2_1440w.webp)

好了，接下来让我们一起来分析下 vite 的实现原理，并通过一个简单的案例来带大家实现其大体的功能。