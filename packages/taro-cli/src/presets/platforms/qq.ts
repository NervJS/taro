import { IPluginContext } from '@tarojs/service'
import { UnRecursiveTemplate } from '@tarojs/shared'
import { printDevelopmentTip } from '../../util'

class Template extends UnRecursiveTemplate {
  supportXS = true
  Adapter = {
    if: 'qq:if',
    else: 'qq:else',
    elseif: 'qq:elif',
    for: 'qq:for',
    forItem: 'qq:for-item',
    forIndex: 'qq:for-index',
    key: 'qq:key',
    xs: 'wxs',
    type: 'qq'
  }

  buildXsTemplate () {
    return '<wxs module="xs" src="./utils.wxs" />'
  }

  replacePropName (name: string, value: string) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }
}

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'qq',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('qq')

      // 生成 project.config.json
      ctx.generateProjectConfig({
        srcConfigName: 'project.qq.json',
        distConfigName: 'project.config.json'
      })

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'qq',
        fileType: {
          templ: '.qml',
          style: '.qss',
          config: '.json',
          script: '.js',
          xs: '.wxs'
        },
        isUseComponentBuildPage: true,
        template: new Template()
      }

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
