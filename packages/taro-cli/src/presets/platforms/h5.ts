export default (ctx) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
    async fn ({ config }) {
      const { build } = require('../../h5')
      const { appPath, outputPath } = ctx.paths
      const { isWatch, port } = ctx.runOpts
      const { emptyDirectory } = ctx.helper
      const { modifyWebpackChain, modifyBuildAssets, onBuildFinish } = config
      emptyDirectory(outputPath)
      build(appPath, {
        watch: isWatch,
        port
      }, {
        modifyWebpackChain,
        modifyBuildAssets,
        onBuildFinish
      })
    }
  })
}
