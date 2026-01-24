/* eslint-disable no-console */
import * as path from 'node:path'

import BaseCI from './BaseCi'
import { getNpmPkgSync } from './utils/npm'
import { printQrcode2Terminal } from './utils/qrcode'

export default class XhsCI extends BaseCI {
  xhs

  init() {
    if (this.pluginOpts.xhs == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "xhs" 选项')
    }
    const { printLog, processTypeEnum, chalk } = this.ctx.helper
    const { token, appid } = this.pluginOpts.xhs!
    try {
      // 调试使用版本是： xhs-mp-cli@1.9.6
      this.xhs = getNpmPkgSync('xhs-mp-cli', process.cwd()).default
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('请安装依赖：xhs-mp-cli'))
      process.exit(1)
    }

    try {
      this.xhs.setAppConfig({
        appId: appid,
        config: {
          token: token,
        },
      })
    } catch (error) {
      printLog(
        processTypeEnum.ERROR,
        chalk.red('请检查小红书小程序 appid 和 token 是否正确')
      )
      process.exit(1)
    }
  }

  async open() {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(
      processTypeEnum.WARNING,
      '小红书小程序不支持 "--open" 参数打开开发者工具'
    )
  }

  async preview() {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '预览小红书小程序')
      const result = await this.xhs.preview({
        project: {
          projectPath: this.projectPath,
        },
      })
      const qrContent = result.qrcodeUrl
      await printQrcode2Terminal(qrContent)
      const previewQrcodePath = path.join(this.projectPath, 'preview.png')
      printLog(
        processTypeEnum.REMIND,
        `预览二维码已生成，存储在:"${previewQrcodePath}",二维码内容是：${qrContent}`
      )
      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'xhs',
          qrCodeContent: qrContent,
          qrCodeLocalPath: previewQrcodePath,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      printLog(
        processTypeEnum.ERROR,
        chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error}`)
      )

      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'xhs',
          qrCodeContent: '',
          qrCodeLocalPath: '',
        },
        error: new Error(error),
      })
    }
  }

  async upload() {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传代码到小红书开放平台')
      printLog(
        processTypeEnum.REMIND,
        `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`
      )
      const uploadQrcodePath = path.join(this.projectPath, 'upload.png')
      await this.xhs.upload({
        project: {
          projectPath: this.projectPath,
        },
        version: this.version,
        desc: this.desc,
      })
      console.log(
        chalk.green(`体验版上传成功 ${new Date().toLocaleString()}\n`)
      )
      this.triggerUploadHooks({
        success: true,
        data: {
          platform: 'xhs',
          qrCodeContent: '',
          qrCodeLocalPath: uploadQrcodePath,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      printLog(
        processTypeEnum.ERROR,
        chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error}`)
      )

      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'xhs',
          qrCodeContent: '',
          qrCodeLocalPath: '',
        },
        error: new Error(error),
      })
    }
  }
}
