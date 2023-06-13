# 框架搭建

首先我们新建一个项目

在packages下新建一个 bin/vite.js 文件，引入打包之后的cli文件，用来初始化指令：
```js
#!/usr/bin/env node
require('../dist/cli.js')
```

接着新建 src/node/cli.ts 文件，我们进行 cli 的初始化：
```js
import cac from "cac";
const cli = cac('mini-vite');

cli
  .command("[root]", "start dev server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    const { createServer } = await import('./server')
    const server = await createServer()
    await server.listen()
  });

cli.help();
cli.parse();
```

