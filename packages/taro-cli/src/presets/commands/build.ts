export default (ctx) => {
  ctx.registerCommand({
    name: 'build',
    async fn (passed, opts) {
      const { platform } = opts
      await ctx.applyPlugins({
        name: platform
      })
    }
  })
}