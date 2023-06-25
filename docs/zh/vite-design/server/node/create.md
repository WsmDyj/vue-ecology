# 框架搭建
所谓千里之行，始于足下。在本篇文章中，我们先不关注 Vite 的架构，因为我们得先有个东西出来，首先需要初始化一个项目，集成所需的开发环境，工欲善其事，必先利于器。项目会基于 pnpm Monorepo 来管理仓库中的包和依赖。

> TIP：可以直接 clone 该文件，运行 pnpm i 安装依赖即可
>
> 完整代码：[https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite](https://github.com/WsmDyj/vue-ecology/tree/main/codes/course01/vite) 


首先，新建一个项目夹(vite)， `pnpm init` 初始化项目并安装typescript，接着新建两个文件夹（packages、playground）用于存放实现vite代码以及演示项目
```sh
$ mkdir vite
$ pnpm init
$ pnpm add typescript @types/node -w -D
```
通过 pnpm 管理这两个仓库，新建 `pnpm-workspace.yaml` 文件，配置如下。并在这两个文件夹下分别执行 `pnpm init` 进行初始化
```sh
packages: 
  - 'packages/**'
  - 'playground/**'
```
## packages初始化
进入到 pcakages 文件夹下，这个文件是用来编写vite代码，我们知道 vite dev、vite build 都是一个指令，开发一个类似dev指令 需要在 `packages.json` 中添加bin配置如下：
```json
{
  "name": "vite", // 修改name属性，用于在playground项目中安装自定义的vite模块
  "bin": {
    "vite": "bin/vite.js"
  }
}
```
同时在 packages 安装 `cac` 包用于创建指令， 并新建 src/node/cli.ts 文件内容如下：
```typescript
import cac from "cac"
const cli = cac("vite") // vite 指令
cli
  .command("[root]", "start dev server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    console.log('vite dev 启动项目')
  })
cli.help()
cli.parse()
```
dev 指令创建好之后我们通过 tsup 进行指令打包，安装 `pnpm add tsup --filter vite -D` 并添加一个项目启动命令：
```json
{
  "scripts": {
    "dev": "tsup ./src/node/cli.ts --dts --external esbuild --format cjs,esm --watch --clean"
  }
}
```
运行 `pnpm run dev` 可以看到 packages 下会打包出dist，在 packages 新建这个文件 bin/vite.js 加载打包之后的入口文件，内容如下：
```sh
#!/usr/bin/env node
require('../dist/cli.js')
```
到这里我们完成了 vite dev 指令的创建。在项目中可以通过执行 vite dev 会执行对应 action 中的方法。vite指令遍也是如此。
## playground初始化
上文完成了vite dev指令的生成，接下来需要在playground使用packages下的vite包。通过制定workspace安装本地 vite 包。
```sh
pnpm add vite --filter playground --workspace
```
并添加启动命令：
```
{
 "scripts": {
    "dev": "vite dev"
  }
}
```
在playground下运行 `pnpm run dev` 指令，控制台可以看到输出 **`vite dev 启动项目`**。表明我们的 vite dev 指令生效了，项目搭建成功，后续会逐步实现vite的功能模块。请确保这一步是成功的，如果失败了，可直接拷贝开头已经创建好的模版。

