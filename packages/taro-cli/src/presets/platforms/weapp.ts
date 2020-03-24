import * as path from 'path'
// export const CONFIG_MAP = {
//   [BUILD_TYPES.WEAPP]: {
//     navigationBarTitleText: 'navigationBarTitleText',
//     navigationBarBackgroundColor: 'navigationBarBackgroundColor',
//     enablePullDownRefresh: 'enablePullDownRefresh',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     color: 'color'
//   },
//   [BUILD_TYPES.SWAN]: {
//     navigationBarTitleText: 'navigationBarTitleText',
//     navigationBarBackgroundColor: 'navigationBarBackgroundColor',
//     enablePullDownRefresh: 'enablePullDownRefresh',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     color: 'color'
//   },
//   [BUILD_TYPES.TT]: {
//     navigationBarTitleText: 'navigationBarTitleText',
//     navigationBarBackgroundColor: 'navigationBarBackgroundColor',
//     enablePullDownRefresh: 'enablePullDownRefresh',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     color: 'color'
//   },
//   [BUILD_TYPES.ALIPAY]: {
//     navigationBarTitleText: 'defaultTitle',
//     navigationBarBackgroundColor: 'titleBarColor',
//     enablePullDownRefresh: 'pullRefresh',
//     list: 'items',
//     text: 'name',
//     iconPath: 'icon',
//     selectedIconPath: 'activeIcon',
//     color: 'textColor'
//   },
//   [BUILD_TYPES.QUICKAPP]: {
//     navigationBarTitleText: 'titleBarText',
//     navigationBarBackgroundColor: 'titleBarBackgroundColor',
//     navigationBarTextStyle: 'titleBarTextColor',
//     pageOrientation: 'orientation',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     backgroundTextStyle: false,
//     onReachBottomDistance: false,
//     backgroundColorBottom: false,
//     backgroundColorTop: false,
//     navigationStyle: 'navigationStyle'
//   },
//   [BUILD_TYPES.QQ]: {
//     navigationBarTitleText: 'navigationBarTitleText',
//     navigationBarBackgroundColor: 'navigationBarBackgroundColor',
//     enablePullDownRefresh: 'enablePullDownRefresh',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     color: 'color'
//   },
//   [BUILD_TYPES.JD]: {
//     navigationBarTitleText: 'navigationBarTitleText',
//     navigationBarBackgroundColor: 'navigationBarBackgroundColor',
//     enablePullDownRefresh: 'enablePullDownRefresh',
//     list: 'list',
//     text: 'text',
//     iconPath: 'iconPath',
//     selectedIconPath: 'selectedIconPath',
//     color: 'color'
//   }
// }
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
export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath } = ctx.paths
      const { npm } = ctx.helper
      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.config.json',
        distConfigName: 'project.config.json'
      })
      // build with webpack
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
        isUseComponentBuildPage: true,
        async modifyWebpackChain (chain, webpack) {
          return await ctx.applyPlugins({
            name: 'modifyWebpackChain',
            initialVal: chain,
            opts: webpack
          })
        }
      }
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
