import { IPluginContext } from '@tarojs/service'

import { recursiveReplaceObjectKeys, printDevelopmentTip } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'alipay',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('alipay')

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'my',
        fileType: {
          templ: '.axml',
          style: '.acss',
          config: '.json',
          script: '.js',
          xs: '.sjs'
        },
        isUseComponentBuildPage: false,
        templateAdapter: {
          if: 'a:if',
          else: 'a:else',
          elseif: 'a:elif',
          for: 'a:for',
          forItem: 'a:for-item',
          forIndex: 'a:for-index',
          key: 'a:key',
          xs: 'sjs',
          type: 'alipay'
        },
        isSupportRecursive: true,
        isSupportXS: true
      }

      ctx.modifyMiniConfigs(({ configMap }) => {
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
        Object.keys(configMap).forEach(key => {
          const item = configMap[key]
          if (item.content) {
            recursiveReplaceObjectKeys(item.content, replaceKeyMap)
          }
        })
      })

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
