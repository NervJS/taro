import { IPluginContext } from '@tarojs/service'

import { printDevelopmentTip } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'swan',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      // ctx.generateFrameworkInfo({
      //   platform: config.platform
      // })

      printDevelopmentTip('swan')

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
          script: '.js',
          xs: '.sjs'
        },
        isUseComponentBuildPage: true,
        templateAdapter: {
          if: 's-if',
          else: 's-else',
          elseif: 's-elif',
          for: 's-for',
          forItem: 's-for-item',
          forIndex: 's-for-index',
          key: 's-key',
          xs: 'sjs',
          type: 'swan'
        },
        isSupportRecursive: true,
        isSupportXS: true
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
