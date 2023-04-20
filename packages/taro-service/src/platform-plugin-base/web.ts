import { PLATFORM_TYPE } from '@tarojs/shared'
import { get, merge } from 'lodash'
import * as path from 'path'

import { getPkgVersion } from '../utils/package'
import TaroPlatform from './platform'

import type { TConfig } from '../utils/types'

export abstract class TaroPlatformWeb<T extends TConfig = TConfig> extends TaroPlatform<T> {
  platformType = PLATFORM_TYPE.WEB

  /**
   * 1. 清空 dist 文件夹
   * 2. 输出编译提示
   */
  private async setup () {
    await this.setupTransaction.perform(this.setupWebApp, this)
    this.ctx.onSetupClose?.(this)
  }

  private setupWebApp () {
    const { needClearOutput } = this.config
    if (typeof needClearOutput === 'undefined' || !!needClearOutput) {
      this.emptyOutputDir()
    }
    this.printDevelopmentTip()
  }

  protected printDevelopmentTip () {
    const tips: string[] = []
    const config = this.config
    const { chalk } = this.helper

    if (this.compiler === 'webpack5' && !config.cache?.enable) {
      tips.push(chalk.yellowBright('建议开启持久化缓存功能，能有效提升二次编译速度，详情请参考: https://docs.taro.zone/docs/config-detail#cache。'))
    }

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

    let runnerPkg: string
    switch (this.compiler) {
      case 'webpack5':
        runnerPkg = '@tarojs/webpack5-runner'
        break
      default:
        runnerPkg = '@tarojs/webpack-runner'
    }

    const runner = await npm.getNpmPkg(runnerPkg, appPath)

    return runner.bind(null, appPath)
  }

  /**
   * 准备 runner 参数
   * @param extraOptions 需要额外合入 Options 的配置项
   */
  protected getOptions (extraOptions = {}) {
    const { sourcePath } = this.ctx.paths
    const { initialConfig } = this.ctx
    const { port } = this.ctx.runOpts.options
    const { recursiveMerge, ENTRY, SOURCE_DIR, OUTPUT_DIR } = this.ctx.helper
    const entryFileName = `${ENTRY}.config`
    const entryFile = path.basename(entryFileName)
    const defaultEntry = {
      [ENTRY]: [path.join(sourcePath, entryFile)]
    }
    const customEntry = get(initialConfig, 'h5.entry')
    const config = recursiveMerge(Object.assign({}, this.config), {
      entryFileName: ENTRY,
      env: {
        FRAMEWORK: JSON.stringify(this.config.framework),
        TARO_ENV: JSON.stringify(this.platform),
        TARO_PLATFORM: JSON.stringify(this.platformType),
        TARO_VERSION: JSON.stringify(getPkgVersion())
      },
      devServer: { port },
      sourceRoot: this.config.sourceRoot || SOURCE_DIR,
      outputRoot: this.config.outputRoot || OUTPUT_DIR
    })
    config.entry = merge(defaultEntry, customEntry)

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
    await this.buildTransaction.perform(this.buildWebApp, this, extraOptions)
  }

  private async buildWebApp (extraOptions = {}) {
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
