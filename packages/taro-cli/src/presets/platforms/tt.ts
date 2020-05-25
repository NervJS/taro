export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'tt',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.tt.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'tt',
        fileType: {
          templ: '.ttml',
          style: '.ttss',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: false
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
