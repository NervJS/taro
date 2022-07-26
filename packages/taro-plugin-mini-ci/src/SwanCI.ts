/* eslint-disable no-console */
import * as path from 'path'
import * as shell from 'shelljs'

import BaseCI from './BaseCi'
import generateQrCode from './QRCode'

export default class SwanCI extends BaseCI {
  private swanBin

  protected _init (): void {
    if (this.pluginOpts.swan == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "swan" 选项')
    }
    try {
      this.swanBin = path.resolve(require.resolve('swan-toolkit'), '../../.bin/swan')
    } catch (error) {
      throw new Error('请安装依赖：swan-toolkit')
    }
  }

  open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.WARNING, '百度小程序不支持 "--open" 参数打开开发者工具')
  }

  async upload () {
    const { outputPath } = this.ctx.paths
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '上传体验版代码到百度后台')
    printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
    shell.exec(`${this.swanBin} upload --project-path ${outputPath} --token ${this.pluginOpts.swan!.token} --release-version ${this.version} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'} --desc ${this.desc} --json`, (_code, _stdout, stderr) => {
      if (!stderr) {
        // stdout = JSON.parse(stdout)
        console.log(chalk.green(`上传成功 ${new Date().toLocaleString()}`))
      }
    })
  }

  async preview () {
    const { outputPath } = this.ctx.paths
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '预览百度小程序')
    shell.exec(`${this.swanBin} preview --project-path ${outputPath} --token ${this.pluginOpts.swan!.token} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'} --json`, (_code, stdout, stderr) => {
      if (!stderr) {
        stdout = JSON.parse(stdout)
        console.log('在线预览地址：', stdout.list[0].url)
        // console.log('预览图片：', stdout.list[0].urlBase64)
        // 需要自己将预览二维码打印到控制台
        generateQrCode(stdout.list[0].url)
      }
    })
  }
}
