import * as webpack from 'webpack'
import * as fs from 'fs'
import { join } from 'path'
import { Shortcuts, noop, isString, isObject, isFunction } from '@tarojs/shared'
import { printPrerenderSuccess, printPrerenderFail } from '../utils/logHelper'

import type { NodeVM } from 'vm2'
import type { IAdapter } from '@tarojs/shared/dist/template'
import type { IBuildConfig } from '../utils/types'

type Attributes = Record<string, string>

function unquote (str: string) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

function getAttrValue (value) {
  if (typeof value === 'object') {
    try {
      const res = JSON.stringify(value)
      return `'${res}'`
    } catch (error) {}
  }

  if (value === 'true' || value === 'false' || !isString(value)) {
    return `"{{${value}}}"`
  }

  return `"${unquote(value)}"`
}

interface MiniData {
  [Shortcuts.Childnodes]?: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
  [Shortcuts.Text]?: string
  sid: string
  uid?: string
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
  console?: boolean
  transformData?: (data: MiniData, config: PageConfig) => MiniData
  transformXML?: (data: MiniData, config: PageConfig, xml: string) => MiniData
}

export function validatePrerenderPages (pages: string[], config?: PrerenderConfig) {
  let pageConfigs: PageConfig[] = []

  if (config == null) {
    return pageConfigs
  }

  const { include = [], exclude = [], match } = config

  if (match) {
    const micromatch = require('micromatch')
    pageConfigs = micromatch(pages, match)
      .filter((p: string) => !p.includes('.config'))
      .map((p: string) => ({ path: p, params: {} }))
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
  private stat: webpack.Stats.ToJsonOutput
  private vm: NodeVM
  private appLoaded = false
  private adapter: IAdapter

  public constructor (buildConfig: IBuildConfig, webpackConfig: webpack.Configuration, stat: webpack.Stats, adapter) {
    const VM = require('vm2').NodeVM
    this.buildConfig = buildConfig
    this.outputPath = webpackConfig.output!.path!
    this.globalObject = webpackConfig.output!.globalObject!
    this.prerenderConfig = buildConfig.prerender!
    this.stat = stat.toJson()
    this.adapter = adapter
    this.vm = new VM({
      console: this.prerenderConfig.console ? 'inherit' : 'off',
      require: {
        external: true,
        context: 'sandbox'
      },
      sandbox: this.buildSandbox()
    })
  }

  public async render (): Promise<void> {
    const pages = validatePrerenderPages(Object.keys(this.stat.entrypoints!), this.prerenderConfig)

    if (!this.prerenderConfig.console && !this.appLoaded) {
      process.on('unhandledRejection', noop)
    }

    await this.writeScript('app')

    if (!this.appLoaded) {
      try {
        this.vm.run(`
        const app = require('${this.getRealPath('app')}')
        app.onLaunch()
      `, this.outputPath)
      } catch (error) {
        printPrerenderFail('app')
        console.error(error)
      }
      this.appLoaded = true
      await Promise.resolve()
    }

    await Promise.all(pages.map(p => this.writeScript(p.path)))

    for (const page of pages) {
      try {
        await this.writeXML(page)
        printPrerenderSuccess(page.path)
      } catch (error) {
        printPrerenderFail(page.path)
        console.error(error)
      }
    }
  }

  private getRealPath (path: string, ext = '.js') {
    return join(this.outputPath, path + ext).replace(/\\/g, '\\\\')
  }

  private buildSandbox () {
    const { JSDOM } = require('jsdom')
    const wx = require('miniprogram-simulate/src/api')
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
      __wxConfig: {},
      PRERENDER: true,
      ...mock
    }
  }

  private buildAttributes = (attrs: Attributes) => {
    return Object.keys(attrs)
      .filter(Boolean)
      .filter(k => !k.startsWith('bind') || !k.startsWith('on'))
      .map(k => `${k}=${getAttrValue(attrs[k])} `)
      .join('')
  }

  private renderToXML = (data: MiniData) => {
    let nodeName = data[Shortcuts.NodeName]

    if (nodeName === '#text') {
      return data[Shortcuts.Text]
    }

    if (nodeName === 'static-view' || nodeName === 'pure-view') {
      nodeName = 'view'
    } else if (nodeName === 'static-text') {
      nodeName = 'text'
    } else if (nodeName === 'static-image') {
      nodeName = 'image'
    }

    // eslint-disable-next-line dot-notation
    if (data['disablePrerender'] || data['disable-prerender']) {
      return ''
    }

    const style = data[Shortcuts.Style]
    const klass = data[Shortcuts.Class]
    const id = data.uid || data.sid
    const children = data[Shortcuts.Childnodes] ?? []

    const omitBy = require('lodash').omitBy
    const attrs = omitBy(data, (_, key) => {
      const internal = [Shortcuts.NodeName, Shortcuts.Childnodes, Shortcuts.Class, Shortcuts.Style, Shortcuts.Text, 'uid', 'sid']
      return internal.includes(key) || key.startsWith('data-')
    })

    return `<${nodeName}${style ? ` style="${style}"` : ''}${klass ? ` class="${klass}"` : ''}${id ? ` id="${id}"` : ''} ${this.buildAttributes(attrs as Attributes)}>${children.map(this.renderToXML).join('')}</${nodeName}>`
  }

  private async writeXML (config: PageConfig): Promise<void> {
    const { path } = config

    let data = await this.renderToData(config)
    if (isFunction(this.prerenderConfig.transformData)) {
      data = this.prerenderConfig.transformData(data, config)
    }

    let xml = this.renderToXML(data)
    if (isFunction(this.prerenderConfig.transformXML)) {
      xml = this.prerenderConfig.transformXML(data, config, xml)
    }

    const templatePath = this.getRealPath(path, this.buildConfig.fileType.templ)
    const [importTemplate, template] = fs.readFileSync(templatePath, 'utf-8').split('\n')

    let str = `${importTemplate}\n`
    str += `<block ${this.adapter.if}="{{root.uid}}">\n`
    str += `  ${template}\n`
    str += '</block>\n'
    str += `<block ${this.adapter.else}>\n`
    str += `${xml}\n`
    str += '</block>'
    fs.writeFileSync(templatePath, str, 'utf-8')
  }

  private writeScript (path: string): Promise<void> {
    path = this.getRealPath(path)
    return new Promise((resolve) => {
      const s = `
      if (typeof PRERENDER !== 'undefined') {
        module.exports = ${this.globalObject}._prerender
      }`
      fs.appendFile(path, s, 'utf8', () => {
        resolve()
      })
    })
  }

  private renderToData ({ path, params }: PageConfig): Promise<MiniData> {
    return new Promise((resolve, reject) => {
      const dataReceiver = this.vm.run(`
        const page = require('${this.getRealPath(path)}')
        page.route = '${path}'
        module.exports = function (cb) {
          page.onLoad(${JSON.stringify(params || {})}, cb)
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
