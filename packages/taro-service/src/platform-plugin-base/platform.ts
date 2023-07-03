import { PLATFORM_TYPE } from '@tarojs/shared'

import type { Func, IPluginContext, TConfig } from '../utils/types'

interface IWrapper {
  init? (): void
  close? (): void
}

export class Transaction<T = TaroPlatform> {
  wrappers: IWrapper[] = []

  async perform (fn: Func, scope: T, ...args: any[]) {
    this.initAll(scope)
    await fn.call(scope, ...args)
    this.closeAll(scope)
  }

  initAll (scope: T) {
    const wrappers = this.wrappers
    wrappers.forEach(wrapper => wrapper.init?.call(scope))
  }

  closeAll (scope: T) {
    const wrappers = this.wrappers
    wrappers.forEach(wrapper => wrapper.close?.call(scope))
  }

  addWrapper (wrapper: IWrapper) {
    this.wrappers.push(wrapper)
  }
}

export default abstract class TaroPlatform<T extends TConfig = TConfig> {
  protected ctx: IPluginContext
  protected config: T
  protected helper: IPluginContext['helper']
  protected compiler: string

  abstract platformType: PLATFORM_TYPE
  abstract platform: string
  abstract runtimePath: string | string[]

  protected setupTransaction = new Transaction<this>()
  protected buildTransaction = new Transaction<this>()

  constructor (ctx: IPluginContext, config: T) {
    this.ctx = ctx
    this.helper = ctx.helper
    this.config = config
    this.updateOutputPath(config)
    const _compiler = config.compiler
    this.compiler = typeof _compiler === 'object' ? _compiler.type : _compiler
  }

  protected emptyOutputDir (excludes: Array<string | RegExp> = []) {
    const { outputPath } = this.ctx.paths
    this.helper.emptyDirectory(outputPath, { excludes })
  }

  /**
   * 如果分端编译详情 webpack 配置了 output 则需更新 outputPath 位置
   */
  private updateOutputPath (config: TConfig) {
    const platformPath = config.output?.path
    if(platformPath) {
      this.ctx.paths.outputPath = platformPath
    }
  }

  /**
   * 调用 runner 开启编译
   */
  abstract start(): Promise<void>
}
