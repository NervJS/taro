import { chalk, fs } from '@tarojs/helper'
import * as path from 'path'

import { getAllFilesInFolder } from '../util'
import Creator from './creator'

export interface IPluginConf {
  pluginName: string
  type: string
  projectDir: string
  projectName: string
  template: string
  version:string
}

export default class Plugin extends Creator {
  public conf: IPluginConf

  constructor (options: IPluginConf) {
    super()
    this.conf = {
      ...options,
      projectName: path.basename(options.projectDir),
      version: this.getCliVersion()
    }
  }

  getCliVersion () {
    const pkgPath = path.join(this._rootPath, 'package.json')
    const pkg = fs.readJSONSync(pkgPath)
    return pkg.version
  }

  async create () {
    const { projectDir, template, pluginName } = this.conf
    const templatePath = this.templatePath(template)

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`创建插件失败：找不到模板${templatePath}`))
      return
    }

    const logs: string[] = []
    const templateFiles = await getAllFilesInFolder(templatePath)

    templateFiles.forEach(file => {
      const relativePath = path.relative(templatePath, file)
      const destPath = path.join(projectDir, pluginName, relativePath)

      this.template(template, relativePath, destPath, this.conf)
      const destinationPath = this.destinationPath(destPath)

      logs.push(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${destinationPath}`)}`)
    })

    this.fs.commit(() => {
      console.log()
      logs.forEach(log => console.log(log))
      console.log()
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建插件 ${this.conf.pluginName} 成功！`)}`)
    })
  }
}
