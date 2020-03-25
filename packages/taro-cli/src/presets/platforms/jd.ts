export default (ctx) => {
  ctx.registerPlatform({
    name: 'jd',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper

      emptyDirectory(outputPath)

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.jd.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'jd',
        fileType: {
          templ: '.jxml',
          style: '.jxss',
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
