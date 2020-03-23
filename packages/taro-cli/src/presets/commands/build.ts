export default (ctx) => {
  ctx.registerCommand({
    name: 'build',
    async fn (passed, opts) {
      const { platform, config } = opts
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config
        }
      })
    }
  })
}