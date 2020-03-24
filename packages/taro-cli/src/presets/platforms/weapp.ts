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
export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn (opts) {
      const { appPath, nodeModulesPath } = ctx.paths
      const { npm } = ctx.helper
      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.config.json',
        distConfigName: 'project.config.json'
      })
      // build with webpack
      const miniRunnerOpts = {
        ...opts,
        nodeModulesPath,
        buildAdapter: opts.platform,
        isBuildPlugin: false,
        global: 'wx',
        fileType: {
          templ: '.wxml',
          style: '.wxss',
          config: '.json',
          script: '.js'
        }
      }
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
