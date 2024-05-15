# Vite 插件实现
回归上一章节开头的问题，当我们通过引入loadsh，浏览器会报找不到路径，这时需要将三方库的引用地址改成如下结构：
```js
import { get } form 'lodash-es' ==> import { get } from '../../node_modules/loadsh-es'
```
根据功能我们可以分别写三个插件：
1. **resolvePlugin**：根据当前路径的类型(绝对路径、相对路径、模块路经、其他路径)进行不同的处理，返回拼凑好的完整路径
2. **buildPlugin**： 根据路径读取文件代码内容
3. **importAnalysisPlugin**： 改写当前文件代码内容中的import路径

> TIP
>
> 本章节完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/vite-plugin](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course02/vite-plugin) 

在上一章中讲到vite的插件机制，会遍历 resolvePlugins（```插件注册中心```）中的插件执行对应的hook方法。

首先，我们先实现resolvePlugins进行插件的注册，新建文件 src/node/plugin/index.ts 文件，内容如下：
```js
import { Plugin as RollupPlugin, PartialResolvedId, LoadResult, SourceDescription, ObjectHook } from 'rollup'
import { ResolvedConfig } from '../server';

export interface Plugin extends RollupPlugin {
  name: string;
  resolveId?: (id: string, importer?: string) => Promise<PartialResolvedId | null>;
  load?: (id: string) => Promise<LoadResult | null>;
  transform?: (code: string, id: string) => Promise<SourceDescription | null> | SourceDescription | null;
}

export async function resolvePlugins(config: ResolvedConfig): Promise<Plugin[]> {
  return [
    // 自定义插件、配置config中的插件集合
  ]
} 

```
## resolvePlugin 插件
vite 的 resolvePlugin 是一个 Vite 插件,它提供了一些配置参数,用于控制 Vite 如何解析文件路径和模块导入。以下是一些 resolvePlugin 的主要作用:
1. 文件路径解析:
    * extensions: 配置文件名扩展名列表,以便 Vite 在解析文件路径时进行尝试。
    * dedupe: 配置需要进行重复删除的模块名称列表。

2. 模块解析:
    * mainFields: 配置解析 package.json 时优先查找的字段列表,用于确定入口文件。
    * conditions: 配置解析 package.json 时使用的导入条件列表,用于确定兼容的导出格式。
    * alias: 配置路径别名,用于映射模块导入路径。
    * preserveSymlinks: 配置是否保留符号链接,以避免解析错误。

基于开头 loadsh-es 的场景，可以把代码简化为：
```js
import path from 'path'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../server/index'

export const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/

export function resolvePlugin(resolveOptions: ResolvedConfig): Plugin {
  return {
    name: 'vite:resolve',
    async resolveId(id, importer) {
      const { root } = resolveOptions
      // 根目录
      if (id[0] === '/' && !id.startsWith(root)) {
        const fsPath = path.resolve(root, id.slice(1))
        return { id: fsPath }
      }
      // 相对路径
      if (id.startsWith('.')) {
        const basedir = importer ? path.dirname(importer) : process.cwd()
        const fsPath = path.join(basedir, id)
        return { id: fsPath }
      }
      // 绝对路径
      if (path.isAbsolute(id)) {
        return { id };
      }
      // 第三方库
      if (bareImportRE.test(id)) {
        let prefix = path.resolve(root, 'node_modules', id)
        const module = require(prefix + '/package.json').module
        const fsPath = path.join(prefix, module)
        return { id: fsPath }
      }
      return null
    }
  }
}
```
当代码中引入了第三方库，我们会根据root找到项目中的 node_modules包，然后读取包中的package.json配置的module入口，这样我们就能得到这个第三方包的完整路径地址。当然还有比如我们在vite.config.ts中配置的别名alias等，也会在这里进行转换得到其真正完整的地址，感兴趣的也可以在这基础上扩充。
## buildPlugin 插件
buildPlugin允许开发者在 Vite 的构建过程中定制化和扩展构建行为，主要有以下功能：
1. 在Vite构建流程的各个阶段注入自定义的行为，比如:
    * 在打包开始前做一些预处理
    * 修改输出文件的内容（比如vue、tsx、jsx文件等）
    * 在构建完成后做一些收尾工作
2. 集成第三方工具和库,将它们无缝地融入到Vite的构建流程中，比如:
    * 使用TypeScript编译器
    * 压缩输出文件
    * 分析打包结果
3. 创建自定义的构建流程,满足特定项目的需求，比如:
    * 构建多个应用或库
    * 为不同的环境生成不同的构建产物
    * 处理一些特殊的资源文件

这里我们这做一些简单的处理，后面将会扩展解析.vue文件等，先根据第一步获取到的路径，解析当前文件，返回文件中的代码内容：
```js
import { Plugin } from '../plugin'
import { readFile } from 'fs/promises'

export function buildPlugin(): Plugin {
  return {
    name: 'vite:esbuild',
    async load(id) {
      try {
        const code = await readFile(id, "utf-8");
        return code;
      } catch (e) {
        return null;
      }
    },
  }
}
```
## importAnalysisPlugin 插件
importAnalysisPlugin插件主要负责分析和优化 JavaScript 和 TypeScript 文件中的导入语句。根据id改写真实的场景，其主要作用：
1. 静态分析导入语句
    * 对源代码进行静态分析,识别所有的导入语句(如 import、require、dynamic import 等)。
    * 解析这些导入语句,获取被导入的模块及其相对路径。
2. 优化导入路径
    * 根据 Vite 的配置,尝试将相对路径转换为绝对路径或别名。
    * 优化导入路径,以提高代码可读性和打包效率。
3. 处理动态导入
    * 分析动态导入语句(如 import()),并尝试将其转换为标准的静态导入。
    * 这可以帮助 Vite 更好地进行代码分割和按需加载。
4. 提供 API 钩子
    * importAnalysisPlugin 暴露了一些 API 钩子,允许开发者自定义导入语句的分析和转换逻辑。
    * 这些钩子可以用于实现自定义的导入路径解析、别名转换等功能。


其简化版代码如下：
```js
import { init, parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'
import { Plugin } from '../plugin'
import { ResolvedConfig } from '../server/index'

export function importAnalysisPlugin(config: ResolvedConfig): Plugin {
  const {root } = config
  return {
    name: 'vite:import-analysis',
    async transform(source, importer) {
      let s = new MagicString(source)
      await init
      // ES Module 语法的词法分析利器
      const [imports, exports] = parseImports(source) 
      // 去掉rootDir的前缀
      const normalizeUrl = async (url: string, pos: number) => {
        const resolved = await (this as any).resolve(url, importer);
        if (resolved.id.startsWith(root + "/")) {
          url = resolved.id.slice(root.length)
        }
        return [url, resolved.id]
      }
      await Promise.all(imports.map(async (importSpecifier, index) => {
        const {
          n: specifier,
          s: start,
          e: end,
        } = importSpecifier
        
         if (specifier) {
            const [url, resolvedId] = await normalizeUrl(specifier, start)
            s.overwrite(start, end, url)
         }
      }))
      return { code: s.toString() }
    }
  }
}
```
vite:import-analysis插件重写了import语句的路径，我们通过es-module-lexer 这个库得到文件中所有的ES Module 语法的词法数组，会得到下面的数据：
```
// n 表示模块的名称
// s 表示模块名称在导入语句中的开始位置
// e 表示模块名称在导入语句中的结束位置
// ss 表示导入语句在源代码中的开始位置
// se 表示导入语句在源代码中的结束位置
// d 表示导入语句是否为动态导入，如果是则为对应的开始位置，否则默认为 -1
// [
//   { n: 'vue', s: 27, e: 30, ss: 0, se: 31, d: -1, a: -1 },
//   { n: './App.vue', s: 49, e: 58, ss: 32, se: 59, d: -1, a: -1 },
//   { n: './index.css', s: 68, e: 79, ss: 60, se: 80, d: -1, a: -1 }
// ]
```
这个数组表示当前文件中所有导入的模块在代码中的位置，然后根据 MagicString这个库 （magic-string是一个用于处理字符串的JavaScript库。它可以让你在字符串中进行插入、删除、替换等操作）对相对位置改写成完整的地址。最后得到：
```js
import { get } from 'lodash-es' // 被重写为 ==>
import { get } from '/node_modules/lodash-es/lodash.js'
```
因此在main.js中可以成功调用loadsh-es的方法。

## 小结
<center>
  <ZoomImg src="../../../../public/images/plugin/plugin06.jpg" />
</center>
在这一章中我们通过自定义了三个插件，resolvePlugin用来得到完整的路径，buildPlugin用来加载文件内容，importAnalysisPlugin用来重写文件中导入的模块地址。通过这个我们便可以加载第三方库，相对导入地址、或者自定义别名等解析规则。

当我们可以正常使用lodash中的方法时，打开控制台会发现页面中加载了600多个请求，因为在lodash中很多方法之间是相互引用的，层级比较深。每个import都会触发一次新的文件请求，因此在这种依赖层级深、涉及模块数量多的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 6 个 HTTP 并发请求的限制，导致页面加载十分缓慢。因此我们需要将 lodash-es这个库的代码被打包成了一个文件，这样就能大大减少网络请求，这就是下一章我们要解决的问题，也是 vite **依赖的预构建** 的一个重点。
<table rules="none">
<tr>
<td style="width: 40%">
<ZoomImg style="width: 100%;" src="../../../../public/images/plugin/plugin07.png" />
</td>
<td style="width: 10%">
<h1>==></h1>
</td>
<td style="font-size: 16px; width: 50%">
<ZoomImg style="width: 100%;" src="../../../../public/images/plugin/plugin08.png" />
</td>
</tr>
</table>  