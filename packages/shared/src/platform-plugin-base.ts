import type { IPluginContext } from '@tarojs/service'
import type { RecursiveTemplate, UnRecursiveTemplate } from './template'

interface IFileType {
  templ: string
  style: string
  config: string
  script: string
  xs?: string
}

export class TaroPlatformBase {
  ctx: IPluginContext
  helper: IPluginContext['helper']
  config: any
  platform: string
  globalObject: string
  fileType: IFileType
  template: RecursiveTemplate | UnRecursiveTemplate

  constructor (ctx: IPluginContext, config) {
    this.ctx = ctx
    this.helper = ctx.helper
    this.config = config
  }

  /**
   * 1. 清空 dist 文件夹
   * 2. 输出提示
   */
  setup () {
    this.emptyOutputDir()
    this.printDevelopmentTip(this.platform)
  }

  emptyOutputDir () {
    const { outputPath } = this.ctx.paths
    this.helper.emptyDirectory(outputPath)
  }

  printDevelopmentTip (platform: string) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') return

    const { isWindows, chalk } = this.helper
    let exampleCommand

    if (isWindows) {
      exampleCommand = `$ set NODE_ENV=production && taro build --type ${platform} --watch`
    } else {
      exampleCommand = `$ NODE_ENV=production taro build --type ${platform} --watch`
    }

    console.log(chalk.yellowBright(`Tips: 预览模式生成的文件较大，设置 NODE_ENV 为 production 可以开启压缩。
Example:
${exampleCommand}
`))
  }

  /**
   * 返回当前项目内的 @tarojs/mini-runner 包
   */
  async getRunner () {
    const { appPath } = this.ctx.paths
    const { npm } = this.helper
    const runner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
    return runner.bind(null, appPath)
  }

  /**
   * 准备 mini-runner 参数
   * @param extraOptions 需要额外合入 Options 的配置项
   */
  getOptions (extraOptions = {}) {
    const { ctx, config, globalObject, fileType, template } = this

    return {
      ...config,
      nodeModulesPath: ctx.paths.nodeModulesPath,
      buildAdapter: config.platform,
      globalObject,
      fileType,
      template,
      ...extraOptions
    }
  }

  /**
   * 生成 project.config.json
   * @param src 项目源码中配置文件的名称
   * @param dist 编译后配置文件的名称，默认为 'project.config.json'
   */
  generateProjectConfig (src: string, dist = 'project.config.json') {
    this.ctx.generateProjectConfig({
      srcConfigName: src,
      distConfigName: dist
    })
  }

  /**
   * 递归替换对象的 key 值
   */
  recursiveReplaceObjectKeys (obj, keyMap) {
    Object.keys(obj).forEach(key => {
      if (keyMap[key]) {
        obj[keyMap[key]] = obj[key]
        if (typeof obj[key] === 'object') {
          this.recursiveReplaceObjectKeys(obj[keyMap[key]], keyMap)
        }
        delete obj[key]
      } else if (keyMap[key] === false) {
        delete obj[key]
      } else if (typeof obj[key] === 'object') {
        this.recursiveReplaceObjectKeys(obj[key], keyMap)
      }
    })
  }
}
