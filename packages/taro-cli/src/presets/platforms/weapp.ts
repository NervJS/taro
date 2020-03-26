// const LOG_MAP = {
//   [BUILD_TYPES.WEAPP]: {
//     OPEN: '请打开微信小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.ALIPAY]: {
//     OPEN: '请打开支付宝小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.QQ]: {
//     OPEN: '请打开 QQ 小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.SWAN]: {
//     OPEN: '请打开百度智能小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.TT]: {
//     OPEN: '请打开字节跳动小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.JD]: {
//     OPEN: '请打开京东小程序开发者工具进行查看'
//   },
//   [BUILD_TYPES.QUICKAPP]: {
//     OPEN: '请按快应用端开发流程 https://taro-docs.jd.com/taro/docs/quick-app.html 进行查看'
//   }
// }
// swan page component true
export default (ctx) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.config.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'wx',
        fileType: {
          templ: '.wxml',
          style: '.wxss',
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
