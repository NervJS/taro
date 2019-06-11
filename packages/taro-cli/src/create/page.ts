import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'

import CONFIG from '../config'

import Creator from './creator'

interface IPageConf {
  name: string,
  description?: string,
  template: 'default' | 'mobx' | 'redux',
  typescript?: boolean,
  css: 'none' | 'sass' | 'stylus' | 'less',
  date?: string,
  src?: string,
  projectDir?: string
}

export default class Page extends Creator {
  public rootPath: string
  public conf: IPageConf

  constructor (options: IPageConf) {
    super()
    this.rootPath = this._rootPath

    this.conf = Object.assign({
      projectDir: '',
      template: '',
      description: ''
    }, options)
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
    const pkg = JSON.parse(fs.readFileSync(this.getPkgPath()).toString())
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
    const { template, name, typescript, css, projectDir } = this.conf
    const { createPage } = require(path.join(this.templatePath(), template, 'index.js'))
    createPage(this, {
      page: name,
      projectDir,
      src: CONFIG.SOURCE_DIR,
      template,
      typescript,
      css
    }, () => {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${name} 成功！`)}`)
    })
  }
}
