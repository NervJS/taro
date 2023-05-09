import {
  babelParser,
  babelTraverse,
  chalk,
  DEFAULT_TEMPLATE_SRC,
  fs,
  getUserHomeDir,
  resolveScriptPath,
  TARO_BASE_CONFIG,
  TARO_CONFIG_FOLDER,
  babel
} from '@tarojs/helper'
import { Expression } from 'babel-types'
import { isNil } from 'lodash'
import * as path from 'path'

import Creator from './creator'
import fetchTemplate from './fetchTemplate'
import { createPage } from './init'

export interface IPageConf {
  projectDir: string
  projectName: string
  pageDir: string
  npm: string
  template: string
  description?: string
  pageName: string
  date?: string
  framework: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'
  css: 'none' | 'sass' | 'stylus' | 'less'
  typescript?: boolean
  compiler?: 'webpack4' | 'webpack5' | 'vite'
  isCustomTemplate?: boolean
  customTemplatePath?: string
  subPkg?: string
}
interface IPageArgs extends IPageConf {
  modifyCustomTemplateConfig : TGetCustomTemplate
}
interface ITemplateInfo {
  css: 'none' | 'sass' | 'stylus' | 'less'
  typescript?: boolean
  compiler?: 'webpack4' | 'webpack5' | 'vite'
  template?: string
}

type TCustomTemplateInfo = Omit<ITemplateInfo & {
  isCustomTemplate?: boolean
  customTemplatePath?: string
}, 'template'>

export type TSetCustomTemplateConfig = (customTemplateConfig: TCustomTemplateInfo) => void

type TGetCustomTemplate = (cb: TSetCustomTemplateConfig ) => Promise<void>

const DEFAULT_TEMPLATE_INFO = {
  name: 'default',
  css: 'none',
  typescript: false,
  compiler: 'webpack5'
}
export default class Page extends Creator {
  public rootPath: string
  public conf: IPageConf
  private modifyCustomTemplateConfig: TGetCustomTemplate
  private pageEntryPath: string

  constructor (args: IPageArgs) {
    super()
    this.rootPath = this._rootPath
    const { modifyCustomTemplateConfig, ...otherOptions } = args
    this.conf = Object.assign(
      {
        projectDir: '',
        projectName: '',
        template: '',
        description: ''
      },
      otherOptions
    )
    this.modifyCustomTemplateConfig = modifyCustomTemplateConfig
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

  getPkgTemplateInfo () {
    const pkg = fs.readJSONSync(this.getPkgPath())
    const templateInfo = pkg.templateInfo || DEFAULT_TEMPLATE_INFO
    // set template name
    templateInfo.template = templateInfo.name
    delete templateInfo.name
    return templateInfo
  }

  setPageEntryPath (pageEntryPath: string) {
    this.pageEntryPath = pageEntryPath
  }

  setCustomTemplateConfig (customTemplateConfig: TCustomTemplateInfo) {
    const pkgTemplateInfo = this.getPkgTemplateInfo()
    const { compiler, css, customTemplatePath, typescript } = customTemplateConfig
    const conf = {
      compiler: compiler || pkgTemplateInfo.compiler,
      css: css || pkgTemplateInfo.css,
      typescript: !isNil(typescript) ? typescript : pkgTemplateInfo.typescript,
      customTemplatePath,
      isCustomTemplate: true,
    }
    this.setTemplateConfig(conf)
  }

  setTemplateConfig (templateInfo: ITemplateInfo) {
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
    this.conf.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // apply 插件，由插件设置自定义模版 config
    await this.modifyCustomTemplateConfig(this.setCustomTemplateConfig.bind(this))
    if(!this.conf.isCustomTemplate){
      const pkgTemplateInfo = this.getPkgTemplateInfo()
      this.setTemplateConfig(pkgTemplateInfo)
      if (!fs.existsSync(this.templatePath(this.conf.template))) {
        await this.fetchTemplates()
      }
    }
    this.write()
  }

  //读取文件 的 app.js / app.ts 读取 pages 字段 或者 subpages
  x () {
    const { subPkg, projectDir } = this.conf
    //把路径搞出来
    const test = '/src/pages/index/index.vue'
    const [sourceString, pageString] = test.split('/src')
    const appConfigPath = resolveScriptPath(path.join(projectDir, sourceString, 'src', 'app.config'))
    if(!fs.existsSync(appConfigPath)) return
    const configFileContent = fs.readFileSync(appConfigPath, 'utf-8')
    const ast = babelParser.parse(configFileContent, {
      sourceType: 'module',
      // plugins: ['typescript']
    })

    babelTraverse(ast, {
      ExportDefaultDeclaration (path) {
        const node = path.node.declaration as any
        if (node.type === 'CallExpression' && node.callee.name === 'defineAppConfig') {
          const configNode = node.arguments[0]
          const pages = configNode?.properties.find(node => node.key.name === 'pages')
          console.log(pages)
        }
      },
    })

    debugger
    // if (subPkg) {

    // } else {

    // }
  }

  write () {
    this.x()
    // createPage(this, this.conf, () => {
    //   console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面 ${this.conf.pageName} 成功！`)}`)
    //   console.log(this.pageEntryPath)
    // }).catch(err => console.log(err))
  }
}

export type { Page as PageCreator }