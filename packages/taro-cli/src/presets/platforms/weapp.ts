import { IPluginContext } from '@tarojs/service'

import { printDevelopmentTip } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('weapp')

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
          script: '.js',
          xs: '.wxs'
        },
        isUseComponentBuildPage: true,
        templateAdapter: {
          if: 'wx:if',
          else: 'wx:else',
          elseif: 'wx:elif',
          for: 'wx:for',
          forItem: 'wx:for-item',
          forIndex: 'wx:for-index',
          key: 'wx:key',
          xs: 'wxs',
          type: 'weapp'
        },
        isSupportRecursive: false,
        isSupportXS: true
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
