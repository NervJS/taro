import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'rn',
    useConfigName: 'rn',
    async fn ({ config }) {
      const { appPath, outputPath } = ctx.paths
      const { isWatch, port } = ctx.runOpts
      const { emptyDirectory } = ctx.helper
      const { modifyWebpackChain, modifyBuildAssets, onBuildFinish } = config
      emptyDirectory(outputPath)
      require('../../rn').build(appPath, {
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
