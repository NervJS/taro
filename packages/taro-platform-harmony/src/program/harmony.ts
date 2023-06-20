/* eslint-disable no-console */
import { getPkgVersion } from '@tarojs/cli/dist/util'
import { type TConfig, TaroPlatform } from '@tarojs/service'
import { PLATFORM_TYPE } from '@tarojs/shared'

export abstract class TaroPlatformHarmony<T extends TConfig = TConfig> extends TaroPlatform<T> {
  platformType = PLATFORM_TYPE.HARMONY

  /**
   * 1. 清空 dist 文件夹
   * 2. 输出编译提示
   */
  private async setup () {
    await this.setupTransaction.perform(this.setupHarmonyApp, this)
    this.ctx.onSetupClose?.(this)
  }

  private setupHarmonyApp () {
    const { needClearOutput } = this.config
    if (typeof needClearOutput === 'boolean' && needClearOutput) {
      this.emptyOutputDir()
    }
    this.printDevelopmentTip()
  }

  protected printDevelopmentTip () {
    const tips: string[] = []
    const { chalk } = this.helper

    if (tips.length) {
      console.log(chalk.yellowBright('Tips:'))
      tips.forEach((item, index) => console.log(`${chalk.yellowBright(index + 1)}. ${item}`))
      console.log('\n')
    }
  }

  /**
   * 返回当前项目内的 runner 包
   */
  protected async getRunner () {
    const { appPath } = this.ctx.paths
    const { npm } = this.helper

    const runnerPkg = '@tarojs/vite-runner'
    const runner = await npm.getNpmPkg(runnerPkg, appPath)
    return runner.bind(null, appPath)
  }

  /**
   * 准备 runner 参数
   * @param extraOptions 需要额外合入 Options 的配置项
   */
  protected getOptions (extraOptions = {}) {
    const { recursiveMerge } = this.ctx.helper
    const config = recursiveMerge(Object.assign({}, this.config), {
      env: {
        FRAMEWORK: JSON.stringify(this.config.framework),
        TARO_ENV: JSON.stringify(this.platform),
        TARO_PLATFORM: JSON.stringify(this.platformType),
        TARO_VERSION: JSON.stringify(getPkgVersion())
      },
    })

    return {
      ...config,
      buildAdapter: config.platform,
      platformType: this.platformType,
      ...extraOptions
    }
  }

  /**
   * 调用 runner 开始编译
   * @param extraOptions 需要额外传入 runner 的配置项
   */
  private async build (extraOptions = {}) {
    this.ctx.onBuildInit?.(this)
    await this.buildTransaction.perform(this.buildHarmonyApp, this, extraOptions)
  }

  private async buildHarmonyApp (extraOptions = {}) {
    const runner = await this.getRunner()
    const options = this.getOptions(Object.assign({
      runtimePath: this.runtimePath,
    }, extraOptions))
    await runner(options)
  }

  /**
   * 调用 runner 开启编译
   */
  public async start () {
    await this.setup()
    await this.build()
  }
}
