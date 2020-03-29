export default (ctx) => {
  ctx.registerCommand({
    name: 'convert',
    async fn () {
      const Convertor = require('../../convertor').default
      const convertor = new Convertor(ctx.paths.appPath)
      convertor.run()
    }
  })
}