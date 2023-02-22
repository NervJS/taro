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

import TaroPlatform from './platform'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'

interface IFileType {
  templ: string
  style: string
  config: string
  script: string
  xs?: string
}

export abstract class TaroPlatformBase extends TaroPlatform {
  abstract globalObject: string
  abstract fileType: IFileType
  abstract template: RecursiveTemplate | UnRecursiveTemplate
  projectConfigJson?: string
  taroComponentsPath?: string

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
    if (this.projectConfigJson) {
      this.generateProjectConfig(this.projectConfigJson)
    }
    if (this.ctx.initialConfig.logger?.quiet === false) {
      const { printLog, processTypeEnum } = this.ctx.helper
      printLog(processTypeEnum.START, '开发者工具-项目目录', `${this.ctx.paths.outputPath}`)
    }
  }

  protected printDevelopmentTip (platform: string) {
    const tips: string[] = []
    const config = this.config
    const { chalk } = this.helper

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      const { isWindows } = this.helper
      const exampleCommand = isWindows
        ? `$ set NODE_ENV=production && taro build --type ${platform} --watch`
        : `$ NODE_ENV=production taro build --type ${platform} --watch`

      tips.push(chalk.yellowBright(`预览模式生成的文件较大，设置 NODE_ENV 为 production 可以开启压缩。
Example:
${exampleCommand}`))
    }

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
   * 返回当前项目内的 @tarojs/mini-runner 包
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
        runnerPkg = '@tarojs/mini-runner'
    }

    const runner = await npm.getNpmPkg(runnerPkg, appPath)

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

  private async buildImpl (extraOptions = {}) {
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
