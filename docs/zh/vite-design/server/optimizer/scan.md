# 05｜依赖扫描
> 本章会围绕介绍页中的两个问题继续深入，一是预构建的内容是什么？二是如何找到需要预构建的模块？这里我们统称为vite的依赖扫描。

## 预构建的内容是什么
vite依赖扫描本质就是在项目启动的时候去寻找到需要预构建的模块，并存储这些模块信息。在一个项目中，会存在非常多的模块，并不是所有的模块都需要预构建，**只有  bare module(裸模块) 会执行依赖预构建**。那么什么是 bare module，可以看下下面示例：

```js
// vue、lodash-es 是 bare module
import xxx from "vue"
import xxx from "lodash-es"

// 以下不是裸依赖
import xxx from "./foo.ts" 
import xxx from "/foo.ts" 
```
从示例中可以看出：
* 项目中使用的第三方模块是裸依赖
* 项目中通过路径去访问的模块不是 bare module

## 如何寻找需要构建的依赖
在vite启动的时候如何去寻找 bare module？下面是一个常见的 Vue 项目的模块依赖树：
<ZoomImg src="../../../../public/images/scan/scan01.jpg" />

从图中可以看到 vite 会扫描 【vue】、【axios】、【lodash】这些第三方依赖。因此，要扫描出项目中所有的 bare module，就需要深度遍历整个依赖树，当我们在讨论树的遍历时，一般会关注这两点：

* 什么时候停止遍历，终止条件是什么？
* 如何处理叶子结点？

🤔不妨一起思考下：预构建的入口一般是从html开始，在html中通过路径去访问main.js，vite会继续深入main.js寻找该文件中所有的依赖关系，如果叶子结点是 bare module 模块(vue)就终止，记录下该依赖，相反则继续深入下一个文件App.vue、index.css。当遇到index.css这类文件不处理直接跳过，通过解析App.vue文件记录文件中引用的antd、lodash等模块并停止遍历。

回到刚才的两个问题:

* **什么时候停止遍历**
  1. 当遇到 bare module 节点时，记录下该依赖，停止遍历
  2. 遇到其他 JS 无关的模块，如 CSS、SVG、image 等，因为不是 JS 代码，因此也不需要继续深入遍历

* **如何处理叶子节点**
  1. 【bare module节点】： 如果依赖模块名称 `第一个字符串为字母或 @，且第二个字符串不是 : 冒号 `，就是 bare module。遇到这些模块则记录依赖，停止遍历。
  2. 【非js模块】：根据依赖模块后缀名判断，例如遇到 *.css 等，或者开头为http:的模块，无需任何处理，停止遍历。
  3. 【包含js的模块】：将代码转成 AST，获取其中 import 语句引入的模块，或者正则匹配出所有 import 的模块，然后继续深入遍历这些模块
  4. 【html类型模块】：例如 HTML 或 Vue文件，正则匹配出script内容，再根据 JS 模块进行分析处理，继续深入遍历这些模块

<ZoomImg src="../../../../public/images/scan/scan04.jpg" />

> 🎯 通过分析我们可以得出：当项目中所有的依赖都深度遍历完成，记录的 bare module 对象，就是依赖扫描的结果。

## 实现依赖扫描的过程
其实依赖扫描原理非常简单，复杂的是处理过程，在这其中需要深度遍历整个项目的依赖树，再根据不同的依赖模块做特殊处理。在 Vite 中采用 Esbuild 去实现这一过程。Esbuild 打包的本质也是个深度遍历模块的过程，会根据入口文件深度遍历所有的文件依赖关系。因此利用这一特性，可以大大减少手动实现的复杂成本。依赖扫描实现的过程借助 [Esbuild插件](https://esbuild.github.io/plugins/) 来实现。

在vite中自定义了一个 **esbuildScanPlugin** 插件，其主要的功能分这两点：

* 利用 build.onResolve 这个钩子函数正则匹配出不同的依赖模块，经过处理后返回模块的类型（namespace）和路径（path）。对于不在需要深度遍历的模块可以设置 `external: true` 直接跳过后续的遍历。

* 利用 build.onLoad 这个钩子函数通过正则和模块的类型匹配出对应的模块，经过加工和解析，处理模块代码里的内容，实现不同的业务逻辑，最后返回内容（contents）和文件类型（loader）。

接下来一起看看在vite是如何处理项目中的模块：

