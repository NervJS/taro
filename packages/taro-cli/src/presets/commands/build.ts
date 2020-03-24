export default (ctx) => {
  ctx.registerCommand({
    name: 'build',
    async fn (opts) {
      const { platform, config } = opts
      const { fs } = ctx.helper
      const { outputPath } = ctx.paths
      fs.ensureDirSync(outputPath)
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config
        }
      })
    }
  })
}
