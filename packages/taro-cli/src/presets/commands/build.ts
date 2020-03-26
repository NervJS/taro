export default (ctx) => {
  ctx.registerCommand({
    name: 'build',
    async fn (opts) {
      const { platform, config } = opts
      const { fs } = ctx.helper
      const { outputPath } = ctx.paths
      console.log(ctx.runOpts)
      fs.ensureDirSync(outputPath)
      ctx.registerMethod('modifyWebpackChain')
      ctx.registerMethod('modifyBuildAssets')
      ctx.registerMethod('modifyBuildTempFileContent')
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            async modifyWebpackChain (chain, webpack) {
              ctx.applyPlugins({
                name: 'modifyWebpackChain',
                initialVal: chain,
                opts: {
                  chain,
                  webpack
                }
              })
            },
            async modifyBuildAssets (assets) {
              await ctx.applyPlugins({
                name: 'modifyBuildAssets',
                initialVal: assets,
                opts: {
                  assets
                }
              })
            },
            async modifyBuildTempFileContent (tempFiles) {
              await ctx.applyPlugins({
                name: 'modifyBuildTempFileContent',
                initialVal: tempFiles,
                opts: {
                  tempFiles
                }
              })
            }
          }
        }
      })
    }
  })
}
