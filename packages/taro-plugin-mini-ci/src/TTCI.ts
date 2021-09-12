/* eslint-disable no-console */
import * as tt from 'tt-ide-cli'
import BaseCI from './BaseCi'
import * as cp from 'child_process'
import * as fs from 'fs'

export default class TTCI extends BaseCI {
  async _init () {
    if (this.pluginOpts.tt == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "tt" 选项')
    }
  }

  async _beforeCheck () {
    await tt.loginByEmail(this.pluginOpts.tt!.email, this.pluginOpts.tt!.password)
    return await tt.checkSession()
  }

  open () {
    const { outputPath: projectPath } = this.ctx.paths
    const { chalk } = this.ctx.helper
    const isMac = process.platform === 'darwin'
    const IDE_SCHEMA = 'bytedanceide:'
    const openCmd = isMac ? `open ${IDE_SCHEMA}` : `explorer ${IDE_SCHEMA}`
    if (fs.existsSync(projectPath)) {
      console.log(chalk.green(`open projectPath: ${projectPath}`))
      const openPath = `${openCmd}?path=${projectPath}`
      cp.exec(openPath, (error) => {
        if (!error) {
          console.log('打开IDE成功', openPath)
        } else {
          console.log(chalk.red('打开IDE失败', error))
        }
      })
    } else {
      console.log(chalk.green('open IDE'))
      cp.exec(openCmd, (error) => {
        if (!error) {
          console.log('打开IDE成功')
        } else {
          console.log(chalk.red('打开IDE失败', error))
        }
      })
    }
  }

  async preview () {
    const isLogin = await this._beforeCheck()
    if (!isLogin) return
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const { outputPath } = this.ctx.paths
    try {
      printLog(processTypeEnum.START, '预览字节跳动小程序')
      await tt.preview({
        entry: outputPath,
        force: true
      })
    } catch (error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }

  async upload () {
    const isLogin = await this._beforeCheck()
    if (!isLogin) return
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    const { outputPath } = this.ctx.paths
    try {
      printLog(processTypeEnum.START, '上传代码到字节跳动后台')
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      await tt.upload({
        entry: outputPath,
        version: this.version,
        changeLog: this.desc
      })
    } catch (error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }
}
