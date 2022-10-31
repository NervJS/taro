import { chalk, DEFAULT_TEMPLATE_SRC, getUserHomeDir, TARO_BASE_CONFIG, TARO_CONFIG_FOLDER } from '@tarojs/helper'
import * as fs from 'fs-extra'
import * as path from 'path'

import Creator from './creator'
import fetchTemplate from './fetchTemplate'
import { createPage } from './init'

export interface IPageConf {
  projectDir: string
  projectName: string
  npm: string
  template: string
  description?: string
  pageName: string
  css: 'none' | 'sass' | 'stylus' | 'less'
  typescript?: boolean
  date?: string
  framework: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'
  compiler?: 'webpack4' | 'webpack5' | 'vite'
}

export default class Page extends Creator {
  public rootPath: string
  public conf: IPageConf

  constructor (options: IPageConf) {
    super()
    this.rootPath = this._rootPath

    this.conf = Object.assign(
      {
        projectDir: '',
        projectName: '',
        template: '',
        description: ''
      },
      options
    )
    this.conf.projectName = path.basename(this.conf.projectDir)
  }

  getPkgPath () {
    const projectDir = this.conf.projectDir as string
    let pkgPath = path.join(projectDir, 'package.json')
    if (!fs.existsSync(pkgPath)) {
      // 适配 云开发 项目
      pkgPath = path.join(projectDir, 'client', 'package.json')
      if (!fs.existsSync(pkgPath)) {
        console.log(chalk.yellow('请在项目根目录下执行 taro create 命令!'))
        process.exit(0)
      }
    }
    return pkgPath
  }

  getTemplateInfo () {
    const pkg = fs.readJSONSync(this.getPkgPath())
    const templateInfo = pkg.templateInfo || {
      name: 'default',
      css: 'none',
      typescript: false,
      compiler: 'webpack5'
    }

    // set template name
    templateInfo.template = templateInfo.name
    delete templateInfo.name

    this.conf = Object.assign(this.conf, templateInfo)
  }

  async fetchTemplates () {
    const homedir = getUserHomeDir()
    let templateSource = DEFAULT_TEMPLATE_SRC
    if (!homedir) chalk.yellow('找不到用户根目录，使用默认模版源！')

    const taroConfigPath = path.join(homedir, TARO_CONFIG_FOLDER)
    const taroConfig = path.join(taroConfigPath, TARO_BASE_CONFIG)

    if (fs.existsSync(taroConfig)) {
      const config = await fs.readJSON(taroConfig)
      templateSource = config && config.templateSource ? config.templateSource : DEFAULT_TEMPLATE_SRC
    } else {
      await fs.createFile(taroConfig)
      await fs.writeJSON(taroConfig, { templateSource: DEFAULT_TEMPLATE_SRC })
      templateSource = DEFAULT_TEMPLATE_SRC
    }

    // 从模板源下载模板
    await fetchTemplate(templateSource, this.templatePath(''))
  }

  async create () {
    const date = new Date()
    this.getTemplateInfo()
    this.conf.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    if (!fs.existsSync(this.templatePath(this.conf.template))) {
      await this.fetchTemplates()
    }

    this.write()
  }

  write () {
    createPage(this, this.conf, () => {
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${this.conf.pageName} 成功！`)}`)
    }).catch(err => console.log(err))
  }
}
