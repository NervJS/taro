import { IPluginContext } from '@tarojs/service'

import { printDevelopmentTip } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'tt',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('tt')

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
        isUseComponentBuildPage: false,
        templateAdapter: {
          if: 'tt:if',
          else: 'tt:else',
          elseif: 'tt:elif',
          for: 'tt:for',
          forItem: 'tt:for-item',
          forIndex: 'tt:for-index',
          key: 'tt:key',
          type: 'tt'
        },
        isSupportRecursive: true,
        isSupportXS: false
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
