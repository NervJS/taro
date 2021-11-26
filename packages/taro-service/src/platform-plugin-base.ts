import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { IPluginContext } from '../types/index'

interface IFileType {
  templ: string
  style: string
  config: string
  script: string
  xs?: string
}

interface IWrapper {
  init? (): void
  close? (): void
}

class Transaction {
  wrappers: IWrapper[] = []

  async perform (fn: (...args: any[]) => void, scope: TaroPlatformBase, ...args) {
    this.initAll(scope)
    await fn.call(scope, ...args)
    this.closeAll(scope)
  }

  initAll (scope) {
    const wrappers = this.wrappers
    wrappers.forEach(wrapper => wrapper.init?.call(scope))
  }

  closeAll (scope) {
    const wrappers = this.wrappers
    wrappers.forEach(wrapper => wrapper.close?.call(scope))
  }

  addWrapper (wrapper: IWrapper) {
    this.wrappers.push(wrapper)
  }
}

export abstract class TaroPlatformBase {
  ctx: IPluginContext
  helper: IPluginContext['helper']
  config: any

  abstract platform: string
  abstract globalObject: string
  abstract runtimePath: string | string[]
  abstract fileType: IFileType
  abstract template: RecursiveTemplate | UnRecursiveTemplate
  projectConfigJson?: string
  taroComponentsPath?: string

  setupTransaction = new Transaction()
  buildTransaction = new Transaction()

  constructor (ctx: IPluginContext, config) {
    this.ctx = ctx
    this.helper = ctx.helper
    this.config = config
  }

  /**
   * 1. 清空 dist 文件夹
   * 2. 输出编译提示
   * 3. 生成 project.config.json
   */
  private async setup () {
    await this.setupTransaction.perform(this.setupImpl, this)
    this.ctx.onSetupClose?.(this)
  }

  private setupImpl () {
    const { needClearOutput } = this.config
    if (typeof needClearOutput === 'undefined' || !!needClearOutput) {
      this.emptyOutputDir()
    }
    this.printDevelopmentTip(this.platform)
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '开发者工具-项目目录', `${this.ctx.paths.outputPath}`)
    if (this.projectConfigJson) {
      this.generateProjectConfig(this.projectConfigJson)
    }
  }

  protected emptyOutputDir () {
    const { outputPath } = this.ctx.paths
    this.helper.emptyDirectory(outputPath)
  }

  protected printDevelopmentTip (platform: string) {
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
  protected async getRunner () {
    const { appPath } = this.ctx.paths
    const { npm } = this.helper
    const runner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
    return runner.bind(null, appPath)
  }

  /**
   * 准备 mini-runner 参数
   * @param extraOptions 需要额外合入 Options 的配置项
   */
  protected getOptions (extraOptions = {}) {
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
   * 调用 mini-runner 开始编译
   * @param extraOptions 需要额外传入 @tarojs/mini-runner 的配置项
   */
  private async build (extraOptions = {}) {
    this.ctx.onBuildInit?.(this)
    await this.buildTransaction.perform(this.buildImpl, this, extraOptions)
  }

  private async buildImpl (extraOptions) {
    const runner = await this.getRunner()
    const options = this.getOptions(Object.assign({
      runtimePath: this.runtimePath,
      taroComponentsPath: this.taroComponentsPath
    }, extraOptions))
    await runner(options)
  }

  /**
   * 生成 project.config.json
   * @param src 项目源码中配置文件的名称
   * @param dist 编译后配置文件的名称，默认为 'project.config.json'
   */
  protected generateProjectConfig (src: string, dist = 'project.config.json') {
    if (this.config.isBuildNativeComp) return
    this.ctx.generateProjectConfig({
      srcConfigName: src,
      distConfigName: dist
    })
  }

  /**
   * 递归替换对象的 key 值
   */
  protected recursiveReplaceObjectKeys (obj, keyMap) {
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

  /**
   * 调用 mini-runner 开启编译
   */
  public async start () {
    await this.setup()
    await this.build()
  }
}
