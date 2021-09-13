/* eslint-disable no-console */
import * as shell from 'shelljs'
import * as path from 'path'
import BaseCI from './BaseCi'

export default class SwanCI extends BaseCI {
  private swanBin = path.resolve(require.resolve('swan-toolkit'), '../../.bin/swan')

  protected _init (): void {
    if (this.pluginOpts.swan == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "swan" 选项')
    }
  }

  open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.WARNING, '百度小程序不支持 "--open" 参数打开开发者工具')
  }

  async upload () {
    const { outputPath } = this.ctx.paths
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '上传体验版代码到百度后台')
    printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
    shell.exec(`${this.swanBin} upload --project-path ${outputPath} --token ${this.pluginOpts.swan!.token} --release-version ${this.version} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'} --desc ${this.desc} --json`)
  }

  async preview () {
    const { outputPath } = this.ctx.paths
    shell.exec(`${this.swanBin} preview --project-path ${outputPath} --token ${this.pluginOpts.swan!.token} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'}  --json`)
  }
}
