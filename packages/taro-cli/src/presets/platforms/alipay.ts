import { recursiveReplaceObjectKeys } from '../../util'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'alipay',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'my',
        fileType: {
          templ: '.awml',
          style: '.acss',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: false
      }

      ctx.modifyBuildTempFileContent(({ tempFiles }) => {
        const replaceKeyMap = {
          navigationBarTitleText: 'defaultTitle',
          navigationBarBackgroundColor: 'titleBarColor',
          enablePullDownRefresh: 'pullRefresh',
          list: 'items',
          text: 'name',
          iconPath: 'icon',
          selectedIconPath: 'activeIcon',
          color: 'textColor'
        }
        Object.keys(tempFiles).forEach(key => {
          const item = tempFiles[key]
          if (item.config) {
            recursiveReplaceObjectKeys(item.config, replaceKeyMap)
          }
        })
      })

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
