/* eslint-disable no-console */
import * as miniu from 'miniu'
import * as path from 'path'
import BaseCI from './BaseCi'

/** 文档地址： https://opendocs.alipay.com/mini/miniu/api */
export default class AlipayCI extends BaseCI {
  protected _init (): void {
    if (this.pluginOpts.alipay == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "alipay" 选项')
    }
    const { appPath } = this.ctx.paths
    const { fs } = this.ctx.helper
    const { toolId, privateKeyPath: _privateKeyPath, proxy } = this.pluginOpts.alipay
    const privateKeyPath = path.join(appPath, _privateKeyPath)
    if (!fs.pathExistsSync(privateKeyPath)) {
      throw new Error(`"alipay.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    }

    miniu.setConfig({
      toolId,
      privateKey: fs.readFileSync(privateKeyPath, 'utf-8'),
      proxy
    })
  }

  open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.WARNING, '阿里小程序不支持 "--open" 参数打开开发者工具')
  }

  async upload () {
    const { printLog, processTypeEnum } = this.ctx.helper
    const clientType = this.pluginOpts.alipay!.clientType || 'alipay'
    printLog(processTypeEnum.START, '上传代码到阿里小程序后台', clientType)
    // 上传结果CI库本身有提示，故此不做异常处理
    // TODO 阿里的CI库上传时不能设置“禁止压缩”，所以上传时被CI二次压缩代码，可能会造成报错，这块暂时无法处理; SDK上传不支持设置版本号和描述信息，版本号为线上自增+1
    await miniu.miniUpload({
      project: this.ctx.paths.outputPath,
      appId: this.pluginOpts.alipay!.appId,
      clientType,
      experience: true,
      onProgressUpdate (info) {
        const { status, data } = info
        console.log(status, data)
      }
    })
  }

  async preview () {
    const previewResult = await miniu.miniPreview({
      project: this.ctx.paths.outputPath,
      appId: this.pluginOpts.alipay!.appId,
      clientType: this.pluginOpts.alipay!.clientType || 'alipay',
      qrcodeFormat: 'terminal'
    })
    console.log('预览二维码地址：', previewResult.packageQrcode)
    console.log(previewResult.qrcode)
  }
}
