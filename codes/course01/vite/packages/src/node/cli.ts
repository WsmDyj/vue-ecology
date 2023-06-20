import cac from "cac"
const cli = cac("vite")

cli
  .command("[root]", "start dev server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    console.log('vite dev 启动项目')
  })

cli.help()
cli.parse()
