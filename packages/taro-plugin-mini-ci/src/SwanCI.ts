/* eslint-disable no-console */
import * as path from 'path'
import * as shell from 'shelljs'

import BaseCI from './BaseCi'
import {  resolveNpmSync } from './utils/npm'
import { generateQrcodeImageFile, printQrcode2Terminal } from './utils/qrcode'

export default class SwanCI extends BaseCI {
  private swanBin

  init (): void {
    if (this.pluginOpts.swan == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "swan" 选项')
    }
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      this.swanBin = resolveNpmSync('swan-toolkit/bin/swan',process.cwd())
    } catch (error) {
      printLog(processTypeEnum.ERROR, chalk.red('请安装依赖：swan-toolkit'))
      process.exit(1)
    }
  }

  async open () {
    // 官方CI包不支持CLI打开IDE，吾通过查看百度开发者工具安装包下的cli文件、以及类比微信开发者工具的调用方式，再加上一点“推理”，发现了调用协议，从而实现了此功能
    const { printLog, processTypeEnum, fs } = this.ctx.helper
    const isMac = process.platform === 'darwin'
    const devToolsInstallPath = this.pluginOpts.swan!.devToolsInstallPath || (isMac ? '/Applications/百度开发者工具.app' : 'C:\\Program Files\\swan-ide-gui')
    const cliPath = path.join(devToolsInstallPath, isMac ? '/Contents/MacOS/cli' : '/cli.bat')

    if (!(await fs.pathExists(cliPath))) {
      printLog(processTypeEnum.ERROR, '命令行工具路径不存在', cliPath)
    }
    printLog(processTypeEnum.START, '百度开发者工具...', this.projectPath)
    shell.exec(`${cliPath}  --project-path ${this.projectPath}`)
  }

  async preview () {
    const { printLog, processTypeEnum } = this.ctx.helper
    const previewQrcodePath = path.join(this.projectPath, 'preview.png')
    printLog(processTypeEnum.START, '预览百度小程序')
    shell.exec(`${this.swanBin} preview --project-path ${this.projectPath} --token ${this.pluginOpts.swan!.token} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'} --json`, async (_code, stdout, stderr) => {
      if (!stderr) {
        stdout = JSON.parse(stdout)
        // @ts-ignore
        const qrContent = stdout.list[0].url
        // console.log('预览图片：', stdout.list[0].urlBase64)
        await printQrcode2Terminal(qrContent)
        await generateQrcodeImageFile(previewQrcodePath, qrContent)
        printLog(
          processTypeEnum.REMIND,
          `预览二维码已生成，存储在:"${ previewQrcodePath }",二维码内容是：${ qrContent }`
        )

        this.triggerPreviewHooks({
          success: true,
          data: {
            platform: 'swan',
            qrCodeContent: qrContent,
            qrCodeLocalPath: previewQrcodePath
          }
        })

      } else {
        this.triggerPreviewHooks({
          success: false,
          data: {
            platform: 'swan',
            qrCodeContent: '',
            qrCodeLocalPath: ''
          },
          error: new Error(stderr.split('\n')[0])
        })
      }
    })
  }

  async upload () {
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.START, '上传体验版代码到百度后台')
    printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
    shell.exec(`${this.swanBin} upload --project-path ${this.projectPath} --token ${this.pluginOpts.swan!.token} --release-version ${this.version} --min-swan-version ${this.pluginOpts.swan!.minSwanVersion || '3.350.6'} --desc ${this.desc} --json`, async (_code, stdout, stderr) => {
      if (!stderr) {
        console.log(chalk.green(`上传成功 ${new Date().toLocaleString()}`))
        
        const stdoutRes = JSON.parse(stdout) as UploadResponse
        const qrContent = stdoutRes.schemeUrl
        const uploadQrcodePath = path.join(this.projectPath, 'upload.png')

        await printQrcode2Terminal(qrContent)
        await generateQrcodeImageFile(uploadQrcodePath, qrContent)
        printLog(
          processTypeEnum.REMIND,
          `体验版二维码已生成，存储在:"${ uploadQrcodePath }",二维码内容是：${ qrContent }`
        )
        
        this.triggerUploadHooks({
          success: true,
          data: {
            platform: 'swan',
            qrCodeContent: qrContent,
            qrCodeLocalPath: uploadQrcodePath
          }
        })
      } else {
        this.triggerUploadHooks({
          success: false,
          data: {
            platform: 'swan',
            qrCodeContent: '',
            qrCodeLocalPath: ''
          },
          error: new Error(stderr.split('\n')[0])
        })
      }
    })
  }
  
}

interface UploadResponse {
  fileSize: {
    main: number
    sub: {
      [k : string]: number
    }
  }
  /** 体验码内容 */
  schemeUrl: string
  schemeUrlOpti: unknown
  /** 警告信息 */
  warningList: string[]
}
