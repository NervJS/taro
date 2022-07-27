/* eslint-disable no-console */
import * as path from 'path'

import BaseCI from './BaseCi'
import generateQrCode from './QRCode'

/** 文档地址： https://opendocs.alipay.com/mini/miniu/api */
export default class AlipayCI extends BaseCI {
  miniu
  minidev

  /** 小程序开发者工具安装路径 */
  private devToolsInstallPath: string

  protected _init (): void {
    if (this.pluginOpts.alipay == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "alipay" 选项')
    }
    try {
      this.miniu = require('miniu')
    } catch (error) {
      throw new Error('请安装依赖：miniu')
    }

    const { appPath } = this.ctx.paths
    const { fs } = this.ctx.helper
    const { toolId, privateKeyPath: _privateKeyPath, proxy, devToolsInstallPath } = this.pluginOpts.alipay
    const privateKeyPath = path.isAbsolute(_privateKeyPath) ? _privateKeyPath : path.join(appPath, _privateKeyPath)

    this.devToolsInstallPath = devToolsInstallPath || ''
    if (!fs.pathExistsSync(privateKeyPath)) {
      throw new Error(`"alipay.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    }

    this.miniu.setConfig({
      toolId,
      privateKey: fs.readFileSync(privateKeyPath, 'utf-8'),
      proxy
    })
  }

  open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    const { outputPath: projectPath } = this.ctx.paths
    try {
      this.minidev = require('minidev').minidev
    } catch (error) {
      throw new Error('请安装依赖：minidev')
    }
    this.minidev
      .startIde(
        Object.assign(
          {
            project: projectPath,
            projectType: 'alipay-mini'
          },
          this.devToolsInstallPath ? { appPath: this.devToolsInstallPath } : {}
        )
      )
      .then(() => {
        printLog(processTypeEnum.START, '打开 IDE 成功')
      })
      .catch(res => {
        printLog(processTypeEnum.ERROR, res.message)
      })
  }

  async upload () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const clientType = this.pluginOpts.alipay!.clientType || 'alipay'
    printLog(processTypeEnum.START, '上传代码到阿里小程序后台', clientType)
    // 上传结果CI库本身有提示，故此不做异常处理
    // TODO 阿里的CI库上传时不能设置“禁止压缩”，所以上传时被CI二次压缩代码，可能会造成报错，这块暂时无法处理; SDK上传不支持设置描述信息
    const result = await this.miniu.miniUpload({
      project: this.ctx.paths.outputPath,
      appId: this.pluginOpts.alipay!.appId,
      packageVersion: this.version,
      clientType,
      experience: true,
      onProgressUpdate (info) {
        const { status, data } = info
        console.log(status, data)
      }
    })
    if (result.packages) {
      const allPackageInfo = result.packages.find(pkg => pkg.type === 'FULL')
      const mainPackageInfo = result.packages.find((item) => item.type === 'MAIN')
      const extInfo = `本次上传${allPackageInfo!.size} ${mainPackageInfo ? ',其中主包' + mainPackageInfo.size : ''}`
      console.log(chalk.green(`上传成功 ${new Date().toLocaleString()} ${extInfo}`))
    }
  }

  async preview () {
    const previewResult = await this.miniu.miniPreview({
      project: this.ctx.paths.outputPath,
      appId: this.pluginOpts.alipay!.appId,
      clientType: this.pluginOpts.alipay!.clientType || 'alipay',
      qrcodeFormat: 'base64'
    })
    console.log('预览二维码地址：', previewResult.packageQrcode)
    generateQrCode(previewResult.packageQrcode!)
  }
}
