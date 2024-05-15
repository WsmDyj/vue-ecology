import cac from "../../../../../course02/vite-plugin/playground/node_modules/.pnpm/cac@6.7.14/node_modules/cac/dist"
const cli = cac("vite")

cli
  .command("[root]", "start dev server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    const { createServer } = await import('./server')
    const server = await createServer()
    await server.listen()
  })

cli.help()
cli.parse()
