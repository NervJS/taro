/* eslint-disable no-console */
import * as path from 'path'

import BaseCI from './BaseCi'
import { AlipayInstance } from './types'
import { compareVersion } from './utils/compareVersion'
import { getNpmPkgSync } from './utils/npm'
import { generateQrcodeImageFile, printQrcode2Terminal, readQrcodeImageContent } from './utils/qrcode'



/** 文档地址： https://opendocs.alipay.com/mini/02q29z */
export default class AlipayCI extends BaseCI {
  protected minidev: AlipayInstance

  init (): void {
    if (this.pluginOpts.alipay == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "alipay" 选项')
    }
    const { fs, printLog, processTypeEnum, chalk } = this.ctx.helper
    try {
      this.minidev = getNpmPkgSync('minidev',process.cwd())
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('请安装依赖：minidev'))
      process.exit(1)
    }

    const { appPath } = this.ctx.paths
    const { toolId, privateKey: _privateKey, privateKeyPath: _privateKeyPath } = this.pluginOpts.alipay

    let privateKey = _privateKey
    if (!privateKey) {
      const privateKeyPath = path.isAbsolute(_privateKeyPath) ? _privateKeyPath : path.join(appPath, _privateKeyPath)
      if (!fs.pathExistsSync(privateKeyPath)) {
        printLog(processTypeEnum.ERROR, chalk.red(`"alipay.privateKeyPath"选项配置的路径"${ privateKeyPath }"不存在,本次上传终止`))
        process.exit(1)
      } else {
        privateKey = fs.readFileSync(privateKeyPath, 'utf-8')
      }
    }

    this.minidev.useDefaults({
      config: {
        defaults: {
          'alipay.authentication.privateKey': privateKey,
          'alipay.authentication.toolId': toolId,
        }
      }
    })

  }

  async open () {
    const { devToolsInstallPath } = this.pluginOpts.alipay!
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '小程序开发者工具...', this.projectPath)
      await this.minidev.minidev
        .startIde(
          Object.assign(
            {
              project: this.projectPath
            },
            devToolsInstallPath ? { appPath: devToolsInstallPath } : {}
          )
        )
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(error.message))
    }
  }

  async preview () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const { appid: appId, clientType = 'alipay' } = this.pluginOpts.alipay!
    try {
      const previewResult = await this.minidev.minidev.preview({
        project: this.projectPath,
        appId,
        clientType,
        autoPush: false
      })

      const previewQrcodePath = path.join(this.projectPath, 'preview.png')
      // schema url规则 alipays://platformapi/startapp?appId=xxxx&nbsource=debug&nbsv=返回的临时版本号&nbsn=DEBUG&nboffline=sync&nbtoken=ide_qr&nbprefer=YES
      /** 注意： 这是二维码的线上图片地址， 不是二维码中的内容 */
      const qrcodeUrl = previewResult.qrcodeUrl
      const qrcodeContent = await readQrcodeImageContent(qrcodeUrl)
      // console.log('qrcodeContent', qrcodeContent)
      await generateQrcodeImageFile(previewQrcodePath, qrcodeContent)
      printLog(processTypeEnum.REMIND, `预览版二维码已生成，存储在:"${ previewQrcodePath }",二维码内容是："${ qrcodeContent }"`)

      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'alipay',
          qrCodeContent: qrcodeContent,
          qrCodeLocalPath: previewQrcodePath
        }
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`预览上传失败 ${ new Date().toLocaleString() } \n${ error.message }`))

      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'alipay',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }

  async upload () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const { clientType = 'alipay', appid: appId } = this.pluginOpts.alipay!
    printLog(processTypeEnum.START, '上传代码到阿里小程序后台', clientType)

    //  SDK上传不支持设置描述信息; 版本号必须大于现有版本号
    try {
      const lasterVersion  = await this.minidev.minidev.app.getUploadedVersion({
        appId,
        clientType
      })
      if (compareVersion(this.version, lasterVersion) <=0) {
        printLog(processTypeEnum.ERROR, chalk.red(`上传版本号 "${ this.version }" 必须大于最新上传版本 "${ lasterVersion }"`))
      }
      const result = await this.minidev.minidev.upload({
        project: this.projectPath,
        appId,
        version: this.version,
        clientType,
        experience: true
      })
      /** 注意： 这是二维码的线上图片地址， 不是二维码中的内容 */
      const qrcodeUrl = result.experienceQrCodeUrl!
      const qrcodeContent = await readQrcodeImageContent(qrcodeUrl)

      const uploadQrcodePath = path.join(this.projectPath, 'upload.png')
      await printQrcode2Terminal(qrcodeContent)
      await generateQrcodeImageFile(uploadQrcodePath, qrcodeContent)
      printLog(processTypeEnum.REMIND, `体验版二维码已生成，存储在:"${uploadQrcodePath}",二维码内容是："${qrcodeContent}"`)

      this.triggerUploadHooks({
        success: true,
        data: {
          platform: 'alipay',
          qrCodeContent: qrcodeContent,
          qrCodeLocalPath: uploadQrcodePath
        },
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`体验版上传失败 ${ new Date().toLocaleString() } \n${ error }`))

      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'alipay',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }

}
