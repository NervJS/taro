/* eslint-disable no-console */
import * as path from 'path'

import BaseCI from './BaseCi'
import { TTInstance } from './types'
import { getNpmPkgSync } from './utils/npm'
import { printQrcode2Terminal } from './utils/qrcode'

export default class TTCI extends BaseCI {
  tt: TTInstance

  init () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    if (this.pluginOpts.tt == null) {
      printLog(processTypeEnum.ERROR, chalk.red(('请为"@tarojs/plugin-mini-ci"插件配置 "tt" 选项')))
      process.exit(1)
    }
    try {
      // 调试使用版本是： tt-ide-cli@0.1.13
      this.tt = getNpmPkgSync('tt-ide-cli',process.cwd())
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('请安装依赖：tt-ide-cli'))
      process.exit(1)
    }
  }

  async _beforeCheck () {
    await this.tt.loginByEmail({
      email: this.pluginOpts.tt!.email,
      password: this.pluginOpts.tt!.password,
      dontSaveCookie: false
    })
  }

  async open () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '启动字节跳动开发者工具...', this.projectPath)
    try {
      await this.tt.open({
        project: {
          path: this.projectPath
        }
      })
      console.log(chalk.green(`打开IDE成功`))
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('打开IDE失败', error))
    }
  }

  async preview () {
    await this._beforeCheck()
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '预览字节跳动小程序')
      const previewQrcodePath = path.join(this.projectPath, 'preview.png')
      const previewResult = await this.tt.preview({
        project: {
          path: this.projectPath
        },
        // @ts-ignore
        page: {
          path: ''
        },
        qrcode: {
          format: 'imageFile',
          output: previewQrcodePath,
        },
        copyToClipboard: true,
        cache: true
      })
      console.log(chalk.green(`开发版上传成功 ${ new Date().toLocaleString() }\n`))
      const qrContent = previewResult.shortUrl
      await printQrcode2Terminal(qrContent)
      printLog(
        processTypeEnum.REMIND,
        `预览二维码已生成，存储在:"${ previewQrcodePath }",二维码内容是：${ qrContent },过期时间：${ new Date(previewResult.expireTime * 1000).toLocaleString() }`
      )

      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'tt',
          qrCodeContent: qrContent,
          qrCodeLocalPath: previewQrcodePath
        }
      })

    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`上传失败 ${ new Date().toLocaleString() } \n${ error }`))

      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'tt',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error: new Error(error)
      })
    }
  }

  async upload () {
    await this._beforeCheck()
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传代码到字节跳动后台')
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${ this.version }"，上传描述为：“${ this.desc }”`)
      const uploadQrcodePath = path.join(this.projectPath, 'upload.png')
      const uploadResult = await this.tt.upload({
        project: {
          path: this.projectPath
        },
        qrcode: {
          format: 'imageFile',
          output: uploadQrcodePath,
        },
        version: this.version,
        changeLog: this.desc,
        needUploadSourcemap: true,
        copyToClipboard: false
      })
      console.log(chalk.green(`体验版版上传成功 ${ new Date().toLocaleString() }\n`))
      const qrContent = uploadResult.shortUrl
      await printQrcode2Terminal(qrContent)
      printLog(
        processTypeEnum.REMIND,
        `体验版二维码已生成，存储在:"${ uploadQrcodePath }",二维码内容是："${ qrContent}", 过期时间：${ new Date(uploadResult.expireTime * 1000).toLocaleString() }`
      )

      this.triggerUploadHooks({
        success: true,
        data: {
          platform: 'tt',
          qrCodeContent: qrContent,
          qrCodeLocalPath: uploadQrcodePath
        }
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`上传失败 ${ new Date().toLocaleString() } \n${ error }`))

      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'tt',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error: new Error(error)
      })
    }
  }
}
