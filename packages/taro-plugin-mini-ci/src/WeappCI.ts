/* eslint-disable no-console */
import * as crypto from 'crypto'
import * as ci from 'miniprogram-ci'
import  { Project }from 'miniprogram-ci'
import * as os from 'os'
import * as path from 'path'
import * as shell from 'shelljs'

import BaseCI, { ProjectType } from './BaseCi'
import { generateQrcodeImageFile, printQrcode2Terminal, readQrcodeImageContent } from './utils/qrcode'

export default class WeappCI extends BaseCI {
  private instance: Project
  /** 微信开发者安装路径 */
  private devToolsInstallPath: string

  init () {
    const { appPath } = this.ctx.paths
    const { fs } = this.ctx.helper
    if (this.pluginOpts.weapp == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "weapp" 选项')
    }
    this.devToolsInstallPath = this.pluginOpts.weapp.devToolsInstallPath || (process.platform === 'darwin' ? '/Applications/wechatwebdevtools.app' : 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具')
    delete this.pluginOpts.weapp.devToolsInstallPath

    const weappConfig = {
      type: 'miniProgram' as ProjectType,
      projectPath: this.projectPath,
      appid: this.pluginOpts.weapp!.appid,
      privateKeyPath: this.pluginOpts.weapp!.privateKeyPath,
      ignores: this.pluginOpts.weapp!.ignores,
    }
    const privateKeyPath = path.isAbsolute(weappConfig.privateKeyPath) ? weappConfig.privateKeyPath : path.join(appPath, weappConfig.privateKeyPath)
    if (!fs.pathExistsSync(privateKeyPath)) {
      throw new Error(`"weapp.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    }
    this.instance = new ci.Project(weappConfig)
  }

  async open () {
    const { fs, printLog, processTypeEnum, getUserHomeDir } = this.ctx.helper
    // 检查安装路径是否存在
    if (!(await fs.pathExists(this.devToolsInstallPath))) {
      printLog(processTypeEnum.ERROR, '微信开发者工具安装路径不存在', this.devToolsInstallPath)
      return
    }
    /** 命令行工具所在路径 */
    const cliPath = path.join(this.devToolsInstallPath, os.platform() === 'win32' ? '/cli.bat' : '/Contents/MacOS/cli')
    const isWindows = os.platform() === 'win32'

    // 检查是否开启了命令行
    const errMesg = '工具的服务端口已关闭。要使用命令行调用工具，请打开工具 -> 设置 -> 安全设置，将服务端口开启。详细信息: https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html '
    const installPath = isWindows ? this.devToolsInstallPath : `${this.devToolsInstallPath}/Contents/MacOS`
    const md5 = crypto.createHash('md5').update(installPath).digest('hex')
    const ideStatusFile = path.join(
      getUserHomeDir(),
      isWindows
        ? `/AppData/Local/微信开发者工具/User Data/${md5}/Default/.ide-status`
        : `/Library/Application Support/微信开发者工具/${md5}/Default/.ide-status`
    )
    if (!(await fs.pathExists(ideStatusFile))) {
      printLog(processTypeEnum.ERROR, errMesg)
      return
    }
    const ideStatus = await fs.readFile(ideStatusFile, 'utf-8')
    if (ideStatus === 'Off') {
      printLog(processTypeEnum.ERROR, errMesg)
      return
    }

    if (!(await fs.pathExists(cliPath))) {
      printLog(processTypeEnum.ERROR, '命令行工具路径不存在', cliPath)
    }
    printLog(processTypeEnum.START, '微信开发者工具...', this.projectPath)

    shell.exec(`${cliPath} open --project ${this.projectPath}`)
  }

  async preview () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传开发版代码到微信后台并预览')
      const previewQrcodePath = path.join(this.projectPath, 'preview.jpg')
      const uploadResult = await ci.preview({
        project: this.instance,
        version: this.version,
        desc: this.desc,
        onProgressUpdate: undefined,
        robot: this.pluginOpts.weapp!.robot,
        setting: this.pluginOpts.weapp!.setting,
        qrcodeFormat: 'image',
        qrcodeOutputDest: previewQrcodePath
      })
      if (uploadResult.subPackageInfo) {
        const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
        const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
        const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + (mainPackageInfo.size / 1024) + 'kb' : ''}`
        console.log(chalk.green(`开发版上传成功 ${new Date().toLocaleString()} ${extInfo}\n`))
      }
      let qrContent
      try {
        qrContent = await readQrcodeImageContent(previewQrcodePath)
        await printQrcode2Terminal(qrContent)
        printLog(processTypeEnum.REMIND, `预览二维码已生成，存储在:"${previewQrcodePath}",二维码内容是：${qrContent}`)
      } catch (error) {
        printLog(processTypeEnum.ERROR, chalk.red(`获取预览二维码失败：${error.message}`))
      }

      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'weapp',
          qrCodeContent: qrContent,
          qrCodeLocalPath: previewQrcodePath
        }
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))

      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'weapp',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }

  async upload () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传体验版代码到微信后台')
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      const uploadResult = await ci.upload({
        project: this.instance,
        version: this.version,
        desc: this.desc,
        onProgressUpdate: undefined,
        robot: this.pluginOpts.weapp!.robot,
        setting: this.pluginOpts.weapp!.setting
      })

      if (uploadResult.subPackageInfo) {
        const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
        const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
        const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + (mainPackageInfo.size / 1024) + 'kb' : ''}`
        console.log(chalk.green(`上传成功 ${new Date().toLocaleString()} ${extInfo}\n`))
      }

      const uploadQrcodePath = path.join(this.projectPath, 'upload.png')
      try {
        // 体验码规则： https://open.weixin.qq.com/sns/getexpappinfo?appid=xxx&path=入口路径.html#wechat-redirect
        const qrContent = `https://open.weixin.qq.com/sns/getexpappinfo?appid=${this.pluginOpts.weapp!.appid}#wechat-redirect`
        await printQrcode2Terminal(qrContent)
        await generateQrcodeImageFile(uploadQrcodePath, qrContent)
        printLog(processTypeEnum.REMIND, `体验版二维码已生成，存储在:"${uploadQrcodePath}",二维码内容是："${qrContent}"`)
        printLog(processTypeEnum.REMIND, `可能需要您前往微信后台，将当前上传版本设置为“体验版”`)
        printLog(processTypeEnum.REMIND, `若本次上传的robot机器人和上次一致，并且之前已经在微信后台设置其为“体验版”，则本次无需再次设置`)

        this.triggerUploadHooks({
          success: true,
          data: {
            platform: 'weapp',
            qrCodeContent: qrContent,
            qrCodeLocalPath: uploadQrcodePath
          }
        })
      } catch (error) {
        // 实际读取二维码时有极小概率会读取失败，待观察
        printLog(processTypeEnum.ERROR, chalk.red(`体验二维码生成失败：${error.message}`))

        this.triggerUploadHooks({
          success: true,
          data: {
            platform: 'weapp',
            qrCodeContent: '',
            qrCodeLocalPath: uploadQrcodePath
          },
          error
        })
      }
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))

      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'weapp',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }
}
