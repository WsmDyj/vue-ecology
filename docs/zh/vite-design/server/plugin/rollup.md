# Rollup插件机制
在这一章中，我们通过配置一个Rollup打包Vue3的例子先来了解下Rollup整个打包过程，然后介绍Rollup在打包阶段的一个完整的工作流。

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/rollup-vue3](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/rollup-vue3) 

## Rollup构建 Vue.js 3 项目

整个过程可以分成以下几个步骤：
1. 项目目录和源码准备；
2. 安装依赖；
3. Vue.js 3 的 Rollup 编译脚本配置；
4. 执行开发模式和生产模式的 Vue.js 3 编译。


首先我们准备一个基础项目：
```
├── index.html
├── package.json
├── rollup.config.js
└── src
    ├── app.vue
    └── index.js
```

项目中安装的模块依赖介绍：
```json
{
  "devDependencies": { 
    "@babel/core": "^7.18.6", // Babel 官方模块，用来编译 JavaScript 代码；
    "@babel/preset-env": "^7.18.6", // Babel 官方预设模块，用来辅助 @babel/core 编译最新的 ES 特性；
    "rollup": "^2.77.0", // Rollup 的核心模块，用来执行 Rollup 项目的编译操作；
    "@rollup/plugin-babel": "^5.3.1", // Rollup 的 Babel 插件
    "@rollup/plugin-commonjs": "^22.0.1", // 用来处理打包编译过程中 CommonJS 模块类型的源码；
    "@rollup/plugin-html": "^0.2.4", // 用来管理项目的 HTML 页面文件；
    "@rollup/plugin-node-resolve": "^13.3.0", // 打包处理项目源码在 node_modules 里的使用第三方 npm 模块源码；
    "@rollup/plugin-replace": "^4.0.0", // 用来替换源码内容，例如 JavaScript 源码的全局变量 process.env.NODE_ENV；
    "rollup-plugin-postcss": "^4.0.2", // 将 Vue.js 项目源码的 CSS 内容分离出独立 CSS 文件；
    "rollup-plugin-serve": "^2.0.1", // Rollup 项目开发模式的 HTTP 服务；
    "rollup-plugin-vue": "^6.0.0" // 解析vue文件
  },
}
```

接下来我们配置 rollup.config.js 文件
```js
const path = require('path');
const fs = require('fs');
const { babel } = require('@rollup/plugin-babel');
const vue = require('rollup-plugin-vue');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const html = require('@rollup/plugin-html');
const serve = require('rollup-plugin-serve');

const babelOptions = {
  "presets": [
    '@babel/preset-env',
  ],
  'babelHelpers': 'bundled'
}

module.exports = {
  input: path.join(__dirname, 'src/index.js'),
  output: {
    file: path.join(__dirname, 'dist/index.js'),
  }, 
  plugins: [
    vue(),
    postcss({
      extract: true,
      plugins: []
    }),
    nodeResolve(),
    commonjs(),
    babel(babelOptions),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true
    }),
    html({
      fileName: 'index.html',
      template: () => {
        const htmlFilePath = path.join(__dirname, 'index.html')
        const html = fs.readFileSync(htmlFilePath, { encoding: 'utf8' })
        return html;
      }
    }),
    process.env.NODE_ENV === 'development' ? serve({
      port: 6001,
      contentBase: 'dist'
    }) : null
  ],
}
```
我们对 Rollup 的配置从上到下一步步分析：
* input，开始编译的“入口文件”；
* output，编译的出口文件
* plugins，这个是 Rollup 的插件配置。

看到这里，你是不是觉得 Rollup 的配置比 Webpack 简单很多？没错，这是因为 Rollup 的技术生态就只有 Plugin 的概念，不像 Webpack 有 Loader 和 Plugin 两种技术生态和其它额外的官方配置。完成以上的三个步骤，接下来就进入最终步骤了，也就是编译脚本配置。这里我们需要在 package.json 里配置好执行编译的脚本，如下所示：
```json
{
  "scripts": {
    "dev": "NODE_ENV=development rollup -w -c ./rollup.config.js",
    "build": "NODE_ENV=production rollup -c ./rollup.config.js"
  }
}
```
这个脚本可以让你在当前目录的命令行工具里，直接执行 npm run dev 就可以触发开发模式编译操作，直接执行 npm run build 就可以生产模式编译操作。

通过访问 [http://localhost:6001/](http://localhost:6001/) 可以看到vue3项目已经跑起来了。

在这个项目中我们引用了几个plugin，如果把这些plugin场景的处理逻辑与核心的打包逻辑都写到一起，打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此 ，Rollup 设计出了一套完整的插件机制，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。

## Rollup 插件机制
Vite 在生产环境中通过 Rollup 对整个项目进行打包，开发环境依然沿用 Rollup 设计的一套完整的插件机制。那么rollup插件是什么？ 引用官网的解释：Rollup 插件是一个具有下面描述的一个或多个属性、构建钩子和输出生成钩子的对象。

插件允许你定制 Rollup 的行为，例如，在捆绑之前编译代码，或者在你的 node_modules 文件夹中找到第三方模块。

Rollup 在打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些标志性的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的执行逻辑，也就是"做什么"；另一方面也声明了插件的作用阶段，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。

## Rollup 整体构建阶段
那对于一次完整的构建过程而言， Rollup 内部主要经历了 **Build** 和 **Output** 两大阶段。

Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入Output阶段，完成打包及输出的过程。对于不同的阶段，Rollup 插件会有不同的插件工作流程。

```js
// Build 阶段
const bundle = await rollup.rollup(inputOptions);
// Output 阶段
await Promise.all(outputOptions.map(bundle.write));
// 构建结束
await bundle.close();
```

## Build 阶段工作流
首先，我们来分析 Build 阶段的插件工作流程。对于 Build 阶段，插件 Hook 的调用流程如下图所示:
<table rules="none">
<tr>
<td style="width: 40%">
<ZoomImg src="../../../../public/images/plugin/plugin03.png" />
</td>
<td style="font-size: 16px; width: 60%">

1. options阶段进行配置转换，得到处理后的配置集合
2. 调用 buildStart 钩子，开始构建
3. 进入 resolveId 钩子中解析文件路径。(从 input 配置指定的入口文件开始)
4. 调用 load 钩子加载模块内容。
5. 执行所有的 transform 钩子来对模块内容进行进行自定义的转换，比如 babel 转译。
6. 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 moduleParsed 钩子:
    * 如果是普通的 import，则执行 resolveId 钩子，继续回到步骤3。
    * 如果是动态 import，则执行 resolveDynamicImport 钩子解析路径，如果解析成功，则回到步骤4加载模块，否则回到步骤3通过 resolveId 解析路径。
7. 直到所有的 import 都解析完毕，Rollup 执行buildEnd钩子，Build 阶段结束。
</td>
</tr>
</table>  
