/* eslint-disable no-console */
import BaseCI from './BaseCi'

export default class JdCI extends BaseCI {
  jdCi
  init () {
    if (this.pluginOpts.jd == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "jd" 选项')
    }
    try {
      this.jdCi = require('jd-miniprogram-ci')
    } catch (error) {
      throw new Error('请安装依赖：jd-miniprogram-ci')
    }
  }

  async open () {
    const { printLog, processTypeEnum } = this.ctx.helper
    printLog(processTypeEnum.WARNING, '京东小程序不支持 "--open" 参数打开开发者工具')
  }

  async preview () {
    const { privateKey } = this.pluginOpts.jd!
    const { outputPath } = this.ctx.paths
    const { chalk, printLog, processTypeEnum } = this.ctx.helper

    try {
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      await this.jdCi.preview({
        desc: this.desc,
        privateKey,
        projectPath: outputPath,
        uv: this.version, // 版本号和备注京东小程序暂不支持，后续优化
      })
    } catch(error) {
      console.log(chalk.red(`预览失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }

  async upload () {
    const { privateKey } = this.pluginOpts.jd!
    const { outputPath } = this.ctx.paths
    const { chalk, printLog, processTypeEnum } = this.ctx.helper

    try {
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      await this.jdCi.upload({
        desc: this.desc,
        privateKey,
        projectPath: outputPath,
        uv: this.version, // 版本号和备注京东小程序暂不支持，后续优化
      })
    } catch(error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }
}
