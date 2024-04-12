# Rollup 插件机制
我们知道 Vite 在生产环境中通过 Rollup 对整个项目进行打包，沿用 Rollup 设计的一套完整的插件机制。那么rollup插件是什么？ 引用官网的解释：Rollup 插件是一个具有下面描述的一个或多个属性、构建钩子和输出生成钩子的对象。插件允许你定制 Rollup 的行为，例如，在捆绑之前编译代码，或者在你的 node_modules 文件夹中找到第三方模块。

Rollup 的打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些标志性的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的执行逻辑，也就是"做什么"；另一方面也声明了插件的作用阶段，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。

## Rollup 整体构建阶段
对于一次完整的构建过程而言， Rollup 内部主要经历了 **Build** 和 **Output** 两大阶段。

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
<!-- <center>
  <ZoomImg src="../../../../public/images/plugin/plugin03.png" />
</center> -->
<table rules="none">
<tr>
<td style="width: 50%">
<ZoomImg src="../../../../public/images/plugin/plugin03.png" />
</td>
<td style="font-size: 16px">

1. options进行配置转换，得到处理后的配置集合
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
