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