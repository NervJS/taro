import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as inquirer from 'inquirer'
import * as semver from 'semver'
import { createApp } from './init'
import fetchTemplate from './fetchTemplate'
import Creator from './creator'
import CONFIG from '../config'

export interface IProjectConf {
  projectName: string,
  projectDir: string,
  templateSource: 'default' | 'git' | 'market',
  gitAddress?: string,
  template: string,
  description?: string,
  typescript?: boolean,
  css: 'none' | 'sass' | 'stylus' | 'less',
  date?: string,
  src?: string
}

export default class Project extends Creator {
  public rootPath: string
  public conf: IProjectConf

  constructor (options: IProjectConf) {
    super()
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
    this.ask()
      .then(answers => {
        const date = new Date()
        this.conf = Object.assign(this.conf, answers)
        this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
        this.write()
      })
  }

  ask () {
    const prompts: object[] = []
    const conf = this.conf
    if (typeof conf.projectName !== 'string') {
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

    if (typeof conf.description !== 'string') {
      prompts.push({
        type: 'input',
        name: 'description',
        message: '请输入项目介绍！'
      })
    }

    if (typeof conf.typescript !== 'boolean') {
      prompts.push({
        type: 'confirm',
        name: 'typescript',
        message: '是否需要使用 TypeScript ？'
      })
    }

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

    if (typeof conf.css !== 'string') {
      prompts.push({
        type: 'list',
        name: 'css',
        message: '请选择 CSS 预处理器（Sass/Less/Stylus）',
        choices: cssChoices
      })
    }

    if (typeof conf.template !== 'string') {
      prompts.push({
        type: 'list',
        name: 'templateSource',
        message: '请选择模板来源',
        choices: [{
          name: '默认模板',
          value: 'default'
        }, {
          name: 'git',
          value: 'git'
        }
        /* , {
          name: '模板市场',
          value: 'market'
        } */
        ]
      })

      prompts.push({
        type: 'input',
        name: 'gitAddress',
        message: '请输入 git 地址',
        validate (input) {
          if (!input) return 'git 地址不能为空！'
          return true
        },
        when: answers => answers.templateSource === 'git'
      }, {
        type: 'input',
        name: 'template',
        message: '请输入模板名',
        validate (input) {
          if (!input) return '模板名不能为空！'
          return true
        },
        when: answers => answers.templateSource === 'git'
      })

      /* prompts.push({
        type: 'input',
        name: 'template',
        message: '请输入模板 ID',
        validate (input) {
          if (!input) return '模板 ID 不能为空！'
          return true
        },
        when: answers => answers.templateSource === 'market'
      }) */
    }

    return inquirer.prompt(prompts)
  }

  write (cb?: () => void) {
    this.conf.src = CONFIG.SOURCE_DIR
    fetchTemplate(this, () => {
      createApp(this, this.conf, cb)
        .catch(err => console.log(err))
    })
      .catch(err => console.log(err))
  }
}
