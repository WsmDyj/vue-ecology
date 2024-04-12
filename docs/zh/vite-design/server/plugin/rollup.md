# Rollup构建Vue3项目
在这一章中，我们通过配置一个Rollup打包Vue3的例子先来了解下Rollup整个打包过程，加深大家对Rollup的理解。如果对rollup比较熟悉的同学可以跳过这章。


用 Rollup 来搭建 Vue.js 3 项目，可以分成以下几个步骤：
1. 项目目录和源码准备；
2. 安装依赖；
3. Vue.js 3 的 Rollup 编译脚本配置；
4. 执行开发模式和生产模式的 Vue.js 3 编译。


首先我们准备一个基础项目，本章节完整代码：[案例demo](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/rollup-vue3) 
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

在这个项目中我们引用了8个plugin，如果把这些场景的处理逻辑与核心的打包逻辑都写到一起，打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此 ，Rollup 设计出了一套完整的插件机制，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。