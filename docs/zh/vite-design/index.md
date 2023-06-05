# vite的本质
Vite，一个基于浏览器原生 **ES imports** 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回。在 script 标签中设置 `type="module"`，浏览器会识别这种标签，对于该标签中的import关键字，浏览器会发起http请求获取模块内容，从而做到加载页面内容，完全跳过了打包这个概念。

![](https://pic3.zhimg.com/80/v2-be21ccda836ca3ff547af801b3fae9f2_1440w.webp)
## 现在工程化的痛点
现在前端开发项目，工程化工具已经成为了标准配置，顶流工具应该还是当属 webpack，它可以帮助我们完成从代码开发到打包的全过程。

webpack 的核心原理就是通过分析 JavaScript 中的 require 语句，分析出当前 JavaScript 文件所有的依赖文件，然后递归分析之后，就得到了整个项目的一个依赖图。对图中不同格式的文件执行不同的 loader，比如会把 CSS 文件解析成加载 CSS 标签的 JavaScript 代码，最后基于这个依赖图获取所有的文件。

进行打包处理之后，放在内存中提供给浏览器使用，然后 dev-server 会启动一个测试服务器打开页面，并且在代码文件修改之后可以通过 WebSocket 通知前端自动更新页面，也就是我们熟悉的 `热更新` 功能。

![](https://pic1.zhimg.com/80/v2-88b66eb443afbbb47081b99447c3f744_1440w.webp)

但是随着项目规模的爆炸式增长，webpack 也带来了一些**痛点问题**。

由于 webpack 在项目调试之前，要把所有文件的依赖关系收集完，打包处理后才能启动测试，很多大项目我们执行调试命令后需要等 1 分钟以上才能开始调试。这对于开发者来说，这段时间除了摸鱼什么都干不了，而且热更新也需要等几秒钟才能生效，极大地影响了我们开发的效率。所以针对 webpack 这种打包 bundle 的思路，社区就诞生了 bundless 的框架，Vite 就是其中的佼佼者。

## ES Module粗演示
ES6 Module 也被称作 **ES Module(或 ESM)**， 是由 ECMAScript 官方提出的模块化规范，作为一个官方提出的规范，ES Module 已经得到了现代浏览器的内置支持。
在现代浏览器中, script 标签里设置 type="module"，浏览器会识别所有添加了type='module'的script标签，对于该标签中的import关键字，浏览器会发起http请求获取模块内容。

下面是一个使用 ES Module 的简单例子:

首先我们先声明一个html，通过script
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

