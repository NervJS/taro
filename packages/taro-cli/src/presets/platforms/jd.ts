import { IPluginContext } from '@tarojs/service'
import { UnRecursiveTemplate } from '@tarojs/shared'
import { printDevelopmentTip } from '../../util'

export class Template extends UnRecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'jd:if',
    else: 'jd:else',
    elseif: 'jd:elif',
    for: 'jd:for',
    forItem: 'jd:for-item',
    forIndex: 'jd:for-index',
    key: 'jd:key',
    type: 'jd'
  }

  replacePropName (name, value, componentName) {
    if (name === 'bingdlongtap') return 'bindlongpress'
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }
}

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'jd',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('jd')

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.jd.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'jd',
        fileType: {
          templ: '.jxml',
          style: '.jxss',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: false,
        template: new Template()
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
