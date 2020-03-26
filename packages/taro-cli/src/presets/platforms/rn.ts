import { build } from '../../rn'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'rn',
    useConfigName: 'rn',
    async fn () {
      const { appPath, outputPath } = ctx.paths
      const { isWatch, port } = ctx.runOpts
      const { emptyDirectory } = ctx.helper

      emptyDirectory(outputPath)
      build(appPath, {
        watch: isWatch,
        port
      })
    }
  })
}
