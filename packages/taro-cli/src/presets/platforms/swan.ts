export default (ctx) => {
  ctx.registerPlatform({
    name: 'swan',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, PARSE_AST_TYPE, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      ctx.generateFrameworkInfo({
        platform: config.platform
      })

      // 生成 project.swan.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.swan.json',
        distConfigName: 'project.swan.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'swan',
        fileType: {
          templ: '.swan',
          style: '.css',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: true
      }

      // 百度小程序的页面是由 Component 构造的，需要在页面配置中增加 component: true 配置
      ctx.modifyBuildTempFileContent(({ tempFiles }) => {
        Object.keys(tempFiles).forEach(key => {
          const item = tempFiles[key]
          if (item.type === PARSE_AST_TYPE.PAGE) {
            item.config.component = true
          }
        })
        return tempFiles
      })

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
