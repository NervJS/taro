import { build } from '../../h5'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'h5',
    useConfigName: 'h5',
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
