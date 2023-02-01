/* eslint-disable no-console */
import * as fs from 'fs'
import * as path from 'path'

import BaseCI from './BaseCi'
import { AlipayInstance, DingTalk } from './types'
import { getNpmPkgSync } from './utils/npm'
import { generateQrcodeImageFile } from './utils/qrcode'

/**
 * 钉钉小程序CI https://github.com/open-dingtalk/dingtalk-design-cli/blob/develop/packages/opensdk/package.json
 */
export default class DingtalkCI extends BaseCI {
  protected dingtalkSDK: DingTalk.MiniAppOpenSDK

  private entryPage: string

  init (): void {
    if (this.pluginOpts.dd == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "dd" 选项')
    }
    const { printLog, processTypeEnum, chalk } = this.ctx.helper
    const { token } = this.pluginOpts.dd!
    try {
      this.dingtalkSDK = getNpmPkgSync('dingtalk-miniapp-opensdk', process.cwd()).sdk
    } catch (error) {
      printLog( processTypeEnum.ERROR, chalk.red('请安装依赖：dingtalk-miniapp-opensdk , 该依赖用于CI预览、上传钉钉小程序'))
      process.exit(1)
    }

    this.dingtalkSDK.setConfig({
      appKey: '',
      appSecret: '',
      accessToken: token,
      host: 'https://oapi.dingtalk.com',
    })

    const appInfo = JSON.parse(
      fs.readFileSync(path.join(this.projectPath, 'app.json'), {
        encoding: 'utf8'
      })
    )
    this.entryPage = appInfo.pages[0]
  }

  //  和支付宝小程序共用ide
  async open () {
    const {  devToolsInstallPath, projectType = 'dingtalk-biz' } = this.pluginOpts.dd!
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    let minidev: AlipayInstance
    try {
      minidev = getNpmPkgSync('minidev', process.cwd())
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('请安装依赖：minidev ,该依赖用于编译后自动打开小程序开发者工具'))
      process.exit(1)
    }
    try {
      printLog(processTypeEnum.START, '小程序开发者工具...', this.projectPath)
      await minidev.minidev.startIde(
        Object.assign(
          {
            project: this.projectPath,
            projectType,
          },
          devToolsInstallPath ? { appPath: devToolsInstallPath } : {}
        )
      )
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(error.message))
    }
  }

  //  特性： CI 内部会自己打印二维码； 预览版不会上传到后台，只有预览码作为入口访问
  async preview () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const { appid,   } = this.pluginOpts.dd!
    

    try {
      const previewUrl = await this.dingtalkSDK.previewBuild({
        project: this.projectPath,
        miniAppId: appid,
        page: this.entryPage,
        query: '',
        ignoreHttpReqPermission: true,
        ignoreWebViewDomainCheck: true,
        buildTarget: 'Preview',
        onProgressUpdate (info) {
          //   logger.debug('拉取构建结果', info);
          console.log('info.status', info.status)
          if (info.status === 'failed') {
            console.error('构建失败')
          } else if (info.status === 'overtime') {
            console.error('构建超时')
          } else if (info.status === 'success') {
            console.log('构建成功', info)
          }
        },
      })

      const previewQrcodePath = path.join(this.projectPath, 'preview.png')
      await generateQrcodeImageFile(previewQrcodePath, previewUrl)
      printLog(processTypeEnum.REMIND, `预览版二维码已生成，存储在:"${ previewQrcodePath }",二维码内容是："${ previewUrl }"`)

      this.triggerPreviewHooks({
        success: true,
        data: {
          platform: 'dd',
          qrCodeContent: previewUrl,
          qrCodeLocalPath: previewQrcodePath
        }
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`预览失败 ${ new Date().toLocaleString() } \n${ error.message }`))

      this.triggerPreviewHooks({
        success: false,
        data: {
          platform: 'dd',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }

  // 特性： CI内部暂时未支持上传后返回体验码,等待官方支持： https://github.com/open-dingtalk/dingtalk-design-cli/issues/34
  async upload () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const {  appid } = this.pluginOpts.dd!
    printLog(processTypeEnum.START, '上传代码到钉钉小程序后台')

    let hasDone = false
    const uploadCommonParams = {
      project: this.projectPath,
      miniAppId: appid,
      packageVersion: this.version
    }

    try {
      const result = await this.dingtalkSDK.miniUpload({
        ...uploadCommonParams,
        onProgressUpdate: info => {
          console.log(info)
          const { data = {} as any, status } = info
          const logId = path.basename(data.logUrl || '')
          // @ts-ignore
          const log = data.log

          if (status === 'success') {
            if (!hasDone) {
              console.log('构建成功')
              console.log('本次上传版本号', data.version)
              hasDone = true
            }
          } else if (status === 'building') {
            console.log(
              `构建中，正在查询构建结果。 ${
                logId ? `logId: ${logId}` : ''
              }`
            )
          } else if (status === 'overtime') {
            console.log('构建超时，请重试', log)
          } else if (status === 'failed') {
            console.log('构建失败', logId)
            console.error(log)
          }
        }
      })

      // 体验码规则：dingtalk://dingtalkclient/action/open_micro_app?corpId=xxx&miniAppId=yyy&source=trial&version=构建id&agentId=xxx&pVersion=1&packageType=1
      console.log(chalk.green(`版本 ${ result.packageVersion } 上传成功 ${new Date().toLocaleString()}`))

      this.triggerUploadHooks({
        success: true,
        data: {
          platform: 'dd',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        }
      })
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red(`体验版上传失败 ${new Date().toLocaleString()} \n${error.message}`))

      this.triggerUploadHooks({
        success: false,
        data: {
          platform: 'dd',
          qrCodeContent: '',
          qrCodeLocalPath: ''
        },
        error
      })
    }
  }
}
