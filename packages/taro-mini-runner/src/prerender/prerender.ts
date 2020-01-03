import { Shortcuts, noop, isString, isObject, isFunction } from '@tarojs/shared'
import { NodeVM } from 'vm2'
import * as webpack from 'webpack'
import * as fs from 'fs'
import { join } from 'path'
import { IBuildConfig } from '../utils/types'
import { MINI_APP_FILES } from '../utils/constants'
import { Adapter } from '../template/adapters'

const { JSDOM } = require('jsdom')
const wx = require('miniprogram-simulate/src/api')
const micromatch = require('micromatch')

interface MiniData {
  [Shortcuts.Childnodes]?: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
  [Shortcuts.Text]?: string
  uid: string
}

interface PageConfig {
  path: string
  params: Record<string, unknown>
}

export interface PrerenderConfig {
  match?: string | string[]
  include?: Array<string | PageConfig>
  exclude?: string[]
  mock?: Record<string, unknown>
  transformData?: (data: MiniData, config: PageConfig) => MiniData,
}

export function valiatePrerenderPages (pages: string[], config?: PrerenderConfig) {
  let pageConfigs: PageConfig[] = []

  if (config == null) {
    return pageConfigs
  }

  const { include = [], exclude = [], match = 'pages/**' } = config

  if (match) {
    pageConfigs = micromatch(pages, match).map(p => ({ path: p, params: {} }))
  }

  if (include.length) {
    pageConfigs = []
  }

  for (const page of pages) {
    for (const i of include) {
      if (isString(i) && i === page) {
        pageConfigs.push({
          path: page,
          params: {}
        })
      }

      if (isObject<PageConfig>(i) && i.path === page) {
        pageConfigs.push({
          ...{
            params: {}
          },
          ...i
        })
      }
    }
  }

  pageConfigs = pageConfigs.filter(p => !exclude.includes(p.path))

  return pageConfigs
}

export class Prerender {
  private buildConfig: IBuildConfig
  private globalObject: string
  private outputPath: string
  private prerenderConfig: PrerenderConfig
  public stat: webpack.Stats.ToJsonOutput

  constructor (buildConfig: IBuildConfig, webpackConfig: webpack.Configuration, stat: webpack.Stats) {
    this.buildConfig = buildConfig
    this.outputPath = webpackConfig.output!.path!
    this.globalObject = webpackConfig.output!.globalObject!
    this.prerenderConfig = buildConfig.prerender!
    this.stat = stat.toJson()
  }

  public async render (): Promise<void> {
    const pages = valiatePrerenderPages(Object.keys(this.stat.entrypoints!), this.prerenderConfig)
    await this.writeScript('app')
    await Promise.all(pages.map(p => this.writeScript(p.path)))
    for (const page of pages) {
      try {
        await this.writeXML(page)
      } catch (error) {
        console.log(`prerender 页面 ${page.path} 出现错误：`)
        console.error(error)
      }
    }
  }

  private getRealPath (path: string, ext = '.js') {
    return join(this.outputPath, path + ext)
  }

  private buildSandbox () {
    const Page = (config: unknown) => config
    const App = (config: unknown) => config
    const dom = new JSDOM()
    const mock = this.prerenderConfig.mock
    return {
      ...dom,
      Page,
      App,
      [this.globalObject]: wx,
      getCurrentPages: noop,
      getApp: noop,
      requirePlugin: noop,
      PRERENDER: true,
      ...mock
    }
  }

  private renderToXML = (data: MiniData) => {
    const nodeName = data[Shortcuts.NodeName]

    if (nodeName === '#text') {
      return data[Shortcuts.Text]
    }

    const style = data[Shortcuts.Style]
    const klass = data[Shortcuts.Class]
    const children = data[Shortcuts.Childnodes] ?? []

    return `<${nodeName}${style ? ` style="${style}"` : ''}${klass ? ` class="${klass}"` : ''}>${children.map(this.renderToXML).join('')}</${nodeName}>`
  }

  private async writeXML (config: PageConfig): Promise<void> {
    const { path } = config
    let data = await this.renderToData(config)
    if (isFunction(this.prerenderConfig.transformData)) {
      data = this.prerenderConfig.transformData(data, config)
    }
    const xml = this.renderToXML(data)
    const templatePath = this.getRealPath(path, MINI_APP_FILES[this.buildConfig.buildAdapter].TEMPL)
    const [importTemplate, template] = fs.readFileSync(templatePath, 'utf-8').split('\n')

    let str = `${importTemplate}\n`
    str += `<block ${Adapter.if}="{{root.uid}}">\n`
    str += `  ${template}\n`
    str += '</block>\n'
    str += `<block ${Adapter.else}>\n`
    str += `${xml}\n`
    str += '</block>'
    fs.writeFileSync(templatePath, str, 'utf-8')
  }

  private writeScript (path: string): Promise<void> {
    path = this.getRealPath(path)
    return new Promise((resolve) => {
      const s = `
      if (typeof PRERENDER !== 'undefiend') {
        module.exports = global._prerender
      }`
      fs.appendFile(path, s, 'utf8', () => {
        resolve()
      })
    })
  }

  private renderToData ({ path, params }: PageConfig): Promise<MiniData> {
    return new Promise((resolve, reject) => {
      const vm = new NodeVM({
        console: 'off',
        require: {
          external: true,
          context: 'sandbox'
        },
        sandbox: this.buildSandbox()
      })

      const dataReceiver = vm.run(`
        const app = require('${this.getRealPath('app')}')
        const component = require('${this.getRealPath(path)}')
        app.onLaunch()
        component.route = '${path}'
        module.exports = function (cb) {
          component.onLoad(${JSON.stringify(params || {})}, cb)
        }
      `, this.outputPath)

      dataReceiver((data) => {
        const domTree = data['root.cn.[0]'] || data['root.cn[0]']
        if (domTree == null) {
          reject(new Error('初始化渲染没有任何数据。'))
        }
        resolve(domTree)
      })
    })
  }
}
