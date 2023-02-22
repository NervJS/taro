/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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

  protected emptyOutputDir () {
    const { outputPath } = this.ctx.paths
    this.helper.emptyDirectory(outputPath)
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
