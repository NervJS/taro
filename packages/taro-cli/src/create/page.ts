import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import Creator from './creator'
import { createPage } from './init'


export interface IPageConf {
  projectDir: string,
  projectName: string,
  template: string,
  description?: string,
  pageName: string,
  css: 'none' | 'sass' | 'stylus' | 'less',
  typescript?: boolean,
  date?: string
}

export default class Page extends Creator {
  public rootPath: string
  public conf: IPageConf

  constructor (options: IPageConf) {
    super()
    this.rootPath = this._rootPath

    this.conf = Object.assign({
      projectDir: '',
      projectName: '',
      template: '',
      description: ''
    }, options)
    this.conf.projectName = path.basename(this.conf.projectDir)
  }

  getPkgPath () {
    const projectDir = this.conf.projectDir as string
    const pkgPath = path.join(projectDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      return pkgPath
    }
    return path.join(projectDir, 'client', 'package.json')
  }

  getTemplateInfo () {
    const pkg = fs.readJSONSync(this.getPkgPath())
    const templateInfo = pkg.templateInfo || {
      name: 'default',
      css: 'none',
      typescript: false
    }
    templateInfo.template = templateInfo.name
    delete templateInfo.name
    this.conf = Object.assign(this.conf, templateInfo)
  }

  create () {
    const date = new Date()
    this.getTemplateInfo()
    this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
    this.write()
  }

  write () {
    createPage(this, this.conf, () => {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${this.conf.pageName} 成功！`)}`)
    })
      .catch(err => console.log(err))
  }
}
