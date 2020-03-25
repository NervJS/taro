export default (ctx) => {
  ctx.registerPlatform({
    name: 'qq',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper

      emptyDirectory(outputPath)

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.qq.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'qq',
        fileType: {
          templ: '.qml',
          style: '.qss',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: true
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
