import * as path from 'node:path'

import { CompilerType, createProject, CSSType, FrameworkType, NpmType, PeriodType } from '@tarojs/binding'
import {
  chalk,
  DEFAULT_TEMPLATE_SRC,
  DEFAULT_TEMPLATE_SRC_GITEE,
  fs,
  getUserHomeDir,
  SOURCE_DIR,
  TARO_BASE_CONFIG,
  TARO_CONFIG_FOLDER
} from '@tarojs/helper'
import { isArray } from '@tarojs/shared'
import axios from 'axios'
import * as inquirer from 'inquirer'
import * as ora from 'ora'
import * as semver from 'semver'

import { clearConsole, getPkgVersion, getRootPath } from '../util'
import { TEMPLATE_CREATOR } from './constants'
import Creator from './creator'
import fetchTemplate from './fetchTemplate'

import type { ITemplates } from './fetchTemplate'

export interface IProjectConf {
  projectName: string
  projectDir: string
  npm: NpmType
  templateSource: string
  clone?: boolean
  template: string
  description?: string
  typescript?: boolean
  buildEs5?: boolean
  css: CSSType
  date?: string
  src?: string
  sourceRoot?: string
  env?: string
  autoInstall?: boolean
  hideDefaultTemplate?: boolean
  framework: FrameworkType
  compiler?: CompilerType
  ask?: (config: object) => Promise<void> | void
}

type CustomPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type IProjectConfOptions = CustomPartial<IProjectConf, 'projectName' | 'projectDir' | 'template' | 'css' | 'npm' | 'framework' | 'templateSource'>

interface AskMethods {
  (conf: IProjectConfOptions, prompts: Record<string, unknown>[], choices?: ITemplates[]): void
}

const NONE_AVAILABLE_TEMPLATE = '无可用模板'

export default class Project extends Creator {
  public rootPath: string
  public conf: IProjectConfOptions

  constructor (options: IProjectConfOptions) {
    super(options.sourceRoot)
    const unSupportedVer = semver.lt(process.version, 'v18.0.0')
    if (unSupportedVer) {
      throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v18.0.0+')
    }
    this.rootPath = this._rootPath

    this.conf = Object.assign(
      {
        projectName: '',
        projectDir: '',
        template: '',
        description: '',
        npm: ''
      },
      options
    )
  }

  init () {
    clearConsole()
    console.log(chalk.green('Taro 即将创建一个新项目!'))
    console.log(`Need help? Go and open issue: ${chalk.blueBright('https://tls.jd.com/taro-issue-helper')}`)
    console.log()
  }

  async create () {
    try {
      const answers = await this.ask()
      const date = new Date()
      this.conf = Object.assign(this.conf, answers)
      this.conf.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.write()
    } catch (error) {
      console.log(chalk.red('创建项目失败: ', error))
    }
  }

  async ask () {
    let prompts: Record<string, unknown>[] = []
    const conf = this.conf

    this.askProjectName(conf, prompts)
    this.askDescription(conf, prompts)
    this.askFramework(conf, prompts)
    this.askTypescript(conf, prompts)
    this.askBuildEs5(conf, prompts)
    this.askCSS(conf, prompts)
    this.askNpm(conf, prompts)
    const answers = await inquirer.prompt<IProjectConf>(prompts)

    // Note: 由于 Solid 框架适配 Vite 还存在某些问题，所以在选择 Solid 框架时，不再询问编译工具
    prompts = []
    if (answers.framework === FrameworkType.Solid || conf.framework === FrameworkType.Solid) {
      answers.compiler = CompilerType.Webpack5
    } else {
      this.askCompiler(conf, prompts)
    }
    await this.askTemplateSource(conf, prompts)
    const compilerAndTemplateSourceAnswer = await inquirer.prompt<IProjectConf>(prompts)

    prompts = []
    const templates = await this.fetchTemplates(Object.assign({}, answers, compilerAndTemplateSourceAnswer))
    await this.askTemplate(conf, prompts, templates)
    const templateChoiceAnswer = await inquirer.prompt<IProjectConf>(prompts)

    // 导航步骤扩展
    try {
      if (typeof conf.ask === 'function') {
        const { ask, ...other } = conf
        await ask({ ...other, templatePath: this.templatePath(templateChoiceAnswer.template) })
      }
    } catch (e) {
      console.error(e)
    }

    return {
      ...answers,
      ...compilerAndTemplateSourceAnswer,
      ...templateChoiceAnswer
    }
  }

  askProjectName: AskMethods = function (conf, prompts) {
    if ((typeof conf.projectName) !== 'string') {
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
    } else if (fs.existsSync(conf.projectName!)) {
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
        message: '请输入项目介绍'
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

  askBuildEs5: AskMethods = function (conf, prompts) {
    if (typeof conf.buildEs5 !== 'boolean') {
      prompts.push({
        type: 'confirm',
        name: 'buildEs5',
        message: '是否需要编译为 ES5 ？',
        default: false
      })
    }
  }

  askCSS: AskMethods = function (conf, prompts) {
    const cssChoices = [
      {
        name: 'Sass',
        value: CSSType.Sass
      },
      {
        name: 'Less',
        value: CSSType.Less
      },
      {
        name: 'Stylus',
        value: CSSType.Stylus
      },
      {
        name: '无',
        value: CSSType.None
      }
    ]

    if (typeof conf.css !== 'string') {
      prompts.push({
        type: 'list',
        name: 'css',
        message: '请选择 CSS 预处理器（Sass/Less/Stylus）',
        choices: cssChoices
      })
    }
  }

  askCompiler: AskMethods = function (conf, prompts) {
    const compilerChoices = [
      {
        name: 'Webpack5',
        value: CompilerType.Webpack5
      },
      {
        name: 'Vite',
        value: CompilerType.Vite
      }
    ]

    if (typeof conf.compiler !== 'string') {
      prompts.push({
        type: 'list',
        name: 'compiler',
        message: '请选择编译工具',
        choices: compilerChoices
      })
    }
  }

  askFramework: AskMethods = function (conf, prompts) {
    const frameworks = [
      {
        name: 'React',
        value: FrameworkType.React
      },
      {
        name: 'PReact',
        value: FrameworkType.Preact
      },
      {
        name: 'Vue3',
        value: FrameworkType.Vue3
      },
      {
        name: 'Solid',
        value: FrameworkType.Solid
      }
    ]

    if (typeof conf.framework !== 'string') {
      prompts.push({
        type: 'list',
        name: 'framework',
        message: '请选择框架',
        choices: frameworks
      })
    }
  }

  askTemplateSource: AskMethods = async function (conf, prompts) {
    if (conf.template === 'default' || conf.templateSource) return

    const homedir = getUserHomeDir()
    const taroConfigPath = path.join(homedir, TARO_CONFIG_FOLDER)
    const taroConfig = path.join(taroConfigPath, TARO_BASE_CONFIG)

    let localTemplateSource: string

    // 检查本地配置
    if (fs.existsSync(taroConfig)) {
      // 存在则把模板源读出来
      const config = await fs.readJSON(taroConfig)
      localTemplateSource = config?.templateSource
    } else {
      // 不存在则创建配置
      await fs.createFile(taroConfig)
      await fs.writeJSON(taroConfig, { templateSource: DEFAULT_TEMPLATE_SRC })
      localTemplateSource = DEFAULT_TEMPLATE_SRC
    }

    const choices = [
      {
        name: 'Gitee（最快）',
        value: DEFAULT_TEMPLATE_SRC_GITEE
      },
      {
        name: 'Github（最新）',
        value: DEFAULT_TEMPLATE_SRC
      },
      {
        name: 'CLI 内置默认模板',
        value: 'default-template'
      },
      {
        name: '自定义',
        value: 'self-input'
      },
      {
        name: '社区优质模板源',
        value: 'open-source'
      }
    ]

    if (localTemplateSource && localTemplateSource !== DEFAULT_TEMPLATE_SRC && localTemplateSource !== DEFAULT_TEMPLATE_SRC_GITEE) {
      choices.unshift({
        name: `本地模板源：${localTemplateSource}`,
        value: localTemplateSource
      })
    }

    prompts.push({
      type: 'list',
      name: 'templateSource',
      message: '请选择模板源',
      choices
    }, {
      type: 'input',
      name: 'templateSource',
      message: '请输入模板源！',
      askAnswered: true,
      when (answers) {
        return answers.templateSource === 'self-input'
      }
    }, {
      type: 'list',
      name: 'templateSource',
      message: '请选择社区模板源',
      async choices (answers) {
        const choices = await getOpenSourceTemplates(answers.framework)
        return choices
      },
      askAnswered: true,
      when (answers) {
        return answers.templateSource === 'open-source'
      }
    })
  }

  askTemplate: AskMethods = function (conf, prompts, list = []) {
    const choices = list.map(item => ({
      name: item.desc ? `${item.name}（${item.desc}）` : item.name,
      value: item.value || item.name
    }))

    if (!conf.hideDefaultTemplate) {
      choices.unshift({
        name: '默认模板',
        value: 'default'
      })
    }

    if ((typeof conf.template as 'string' | undefined) !== 'string') {
      prompts.push({
        type: 'list',
        name: 'template',
        message: '请选择模板',
        choices
      })
    }
  }

  askNpm: AskMethods = function (conf, prompts) {
    const packages = [
      {
        name: 'yarn',
        value: NpmType.Yarn
      },
      {
        name: 'pnpm',
        value: NpmType.Pnpm
      },
      {
        name: 'npm',
        value: NpmType.Npm
      },
      {
        name: 'cnpm',
        value: NpmType.Cnpm
      }
    ]

    if ((typeof conf.npm as string | undefined) !== 'string') {
      prompts.push({
        type: 'list',
        name: 'npm',
        message: '请选择包管理工具',
        choices: packages
      })
    }
  }

  async fetchTemplates (answers: IProjectConf): Promise<ITemplates[]> {
    const { templateSource, framework, compiler } = answers
    this.conf.framework = this.conf.framework || framework || ''
    this.conf.templateSource = this.conf.templateSource || templateSource

    // 使用默认模版
    if (answers.templateSource === 'default-template') {
      this.conf.template = 'default'
      answers.templateSource = DEFAULT_TEMPLATE_SRC_GITEE
    }
    if (this.conf.template === 'default' || answers.templateSource === NONE_AVAILABLE_TEMPLATE) return Promise.resolve([])

    // 从模板源下载模板
    const isClone = /gitee/.test(this.conf.templateSource) || this.conf.clone
    const templateChoices = await fetchTemplate(this.conf.templateSource, this.templatePath(''), isClone)

    const filterFramework = (_framework) => {
      const current = this.conf.framework?.toLowerCase()

      if (typeof _framework === 'string' && _framework) {
        return current === _framework.toLowerCase()
      } else if (isArray(_framework)) {
        return _framework?.map(name => name.toLowerCase()).includes(current)
      } else {
        return true
      }
    }

    const filterCompiler = (_compiler) => {
      if (_compiler && isArray(_compiler)) {
        return _compiler?.includes(compiler)
      }
      return true
    }

    // 根据用户选择的框架筛选模板
    const newTemplateChoices: ITemplates[] = templateChoices
      .filter(templateChoice => {
        const { platforms, compiler } = templateChoice
        return filterFramework(platforms) && filterCompiler(compiler)
      })

    return newTemplateChoices
  }

  write (cb?: () => void) {
    this.conf.src = SOURCE_DIR
    const { projectName, projectDir, template, autoInstall = true, framework, npm } = this.conf as IProjectConf
    // 引入模板编写者的自定义逻辑
    const templatePath = this.templatePath(template)
    const handlerPath = path.join(templatePath, TEMPLATE_CREATOR)
    const handler = fs.existsSync(handlerPath) ? require(handlerPath).handler : {}
    createProject({
      projectRoot: projectDir,
      projectName,
      template,
      npm,
      framework,
      css: this.conf.css || CSSType.None,
      autoInstall: autoInstall,
      templateRoot: getRootPath(),
      version: getPkgVersion(),
      typescript: this.conf.typescript,
      buildEs5: this.conf.buildEs5,
      date: this.conf.date,
      description: this.conf.description,
      compiler: this.conf.compiler,
      period: PeriodType.CreateAPP,
    }, handler).then(() => {
      cb && cb()
    })
  }
}

function getOpenSourceTemplates (platform: string) {
  return new Promise((resolve, reject) => {
    const spinner = ora({ text: '正在拉取开源模板列表...', discardStdin: false }).start()
    axios.get('https://gitee.com/NervJS/awesome-taro/raw/next/index.json')
      .then(response => {
        spinner.succeed(`${chalk.grey('拉取开源模板列表成功！')}`)
        const collection = response.data
        switch (platform.toLowerCase()) {
          case 'react':
            return resolve(collection.react)
          default:
            return resolve([NONE_AVAILABLE_TEMPLATE])
        }
      })
      .catch(_error => {
        spinner.fail(chalk.red('拉取开源模板列表失败！'))
        return reject(new Error())
      })
  })
}
