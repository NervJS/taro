import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as inquirer from 'inquirer'
import * as semver from 'semver'
import { createApp } from './init'
import fetchTemplate from './fetchTemplate'
import Creator from './creator'
import CONFIG from '../config'
import { getUserHomeDir, getTemplateSourceType } from '../util'

const TARO_CONFIG_FLODER = '.taro'
const TARO_BASE_CONFIG = 'index.json'
const DEFAULT_TEMPLATE_SRC = 'git@github.com:NervJS/taro-project-templates.git'

export interface IProjectConf {
  projectName: string,
  projectDir: string,
  templateSource: string,
  template: string,
  description?: string,
  typescript?: boolean,
  css: 'none' | 'sass' | 'stylus' | 'less',
  date?: string,
  src?: string,
  sourceRoot?: string
}

interface AskMethods {
  (conf: IProjectConf, prompts: object[], choices?: string[]): void
}

export default class Project extends Creator {
  public rootPath: string
  public conf: IProjectConf

  constructor (options: IProjectConf) {
    super(options.sourceRoot)
    const unSupportedVer = semver.lt(process.version, 'v7.6.0')
    if (unSupportedVer) {
      throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+')
    }
    this.rootPath = this._rootPath

    this.conf = Object.assign({
      projectName: '',
      projectDir: '',
      template: '',
      description: ''
    }, options)
  }

  init () {
    console.log(chalk.green(`Taro即将创建一个新项目!`))
    console.log('Need help? Go and open issue: https://github.com/NervJS/taro/issues/new')
    console.log()
  }

  create () {
    this.fetchTemplates()
      .then((templateChoices: string[]) => this.ask(templateChoices))
      .then(answers => {
        const date = new Date()
        this.conf = Object.assign(this.conf, answers)
        this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
        this.write()
      })
      .catch(err => console.log(chalk.red('创建项目失败: ', err)))
  }

  async fetchTemplates (): Promise<string[]> {
    const conf = this.conf
    // 使用默认模版
    if (conf.template && conf.template === 'default') {
      return Promise.resolve([])
    }

    // 处理模版源取值
    if (!conf.templateSource) {
      const homedir = getUserHomeDir()
      if (!homedir) {
        chalk.yellow('找不到用户根目录，使用默认模版源！')
        conf.templateSource = DEFAULT_TEMPLATE_SRC
      }

      const taroConfigPath = path.join(homedir, TARO_CONFIG_FLODER)
      const taroConfig = path.join(taroConfigPath, TARO_BASE_CONFIG)

      if (fs.existsSync(taroConfig)) {
        const config = await fs.readJSON(taroConfig)
        conf.templateSource = config && config.templateSource ? config.templateSource : DEFAULT_TEMPLATE_SRC
      } else {
        await fs.createFile(taroConfig)
        await fs.writeJSON(taroConfig, { templateSource: DEFAULT_TEMPLATE_SRC })
        conf.templateSource = DEFAULT_TEMPLATE_SRC
      }
    }

    // 从模板源下载模板
    const templateSourceType = getTemplateSourceType(conf.templateSource)
    return fetchTemplate(this, templateSourceType)
  }

  ask (templateChoices: string[]) {
    const prompts: object[] = []
    const conf = this.conf

    this.askProjectName(conf, prompts)
    this.askDescription(conf, prompts)
    this.askTypescript(conf, prompts)
    this.askCSS(conf, prompts)
    this.askTemplate(conf, prompts, templateChoices)

    return inquirer.prompt(prompts)
  }

  askProjectName: AskMethods = function (conf, prompts) {
    if (typeof conf.projectName as string | undefined !== 'string') {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称！',
        validate (input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '当前目录已经存在同名项目，请换一个项目名！'
          }
          return true
        }
      })
    } else if (fs.existsSync(conf.projectName)) {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: '当前目录已经存在同名项目，请换一个项目名！',
        validate (input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '项目名依然重复！'
          }
          return true
        }
      })
    }
  }

  askDescription: AskMethods = function (conf, prompts) {
    if (typeof conf.description !== 'string') {
      prompts.push({
        type: 'input',
        name: 'description',
        message: '请输入项目介绍！'
      })
    }
  }

  askTypescript: AskMethods = function (conf, prompts) {
    if (typeof conf.typescript !== 'boolean') {
      prompts.push({
        type: 'confirm',
        name: 'typescript',
        message: '是否需要使用 TypeScript ？'
      })
    }
  }

  askCSS: AskMethods = function (conf, prompts) {
    const cssChoices = [{
      name: 'Sass',
      value: 'sass'
    }, {
      name: 'Less',
      value: 'less'
    }, {
      name: 'Stylus',
      value: 'stylus'
    }, {
      name: '无',
      value: 'none'
    }]

    if (typeof conf.css as string | undefined !== 'string') {
      prompts.push({
        type: 'list',
        name: 'css',
        message: '请选择 CSS 预处理器（Sass/Less/Stylus）',
        choices: cssChoices
      })
    }
  }

  askTemplate: AskMethods = function (conf, prompts, list = []) {
    const choices = [{
      name: '默认模板',
      value: 'default'
    }, ...list.map(item => ({ name: item, value: item }))]

    if (typeof conf.template as 'string' | undefined !== 'string') {
      prompts.push({
        type: 'list',
        name: 'template',
        message: '请选择模板',
        choices
      })
    }
  }

  write (cb?: () => void) {
    this.conf.src = CONFIG.SOURCE_DIR
    createApp(this, this.conf, cb)
      .catch(err => console.log(err))
  }
}
