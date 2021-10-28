import { RecursiveTemplate, Shortcuts } from '@tarojs/shared/dist/template'
import { fs } from '@tarojs/helper'
import * as path from 'path'

export class Template extends RecursiveTemplate {
  Adapter = {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    for: 'for',
    forItem: 'for-item',
    forIndex: 'for-index',
    key: 'key',
    type: 'harmony'
  }

  nativeComps: string[]

  usedNativeComps: string[] = []

  constructor () {
    super()
    this.voidElements.add('button')
    this.voidElements.add('image')
    this.voidElements.add('static-image')
    this.voidElements.add('camera')
    this.voidElements.add('input')

    this.nativeComps = fs.readdirSync(path.resolve(__dirname, './components-harmony'))
  }

  buildHeaderTemplate = (componentConfig) => {
    if (componentConfig.includeAll) {
      this.usedNativeComps = [...this.nativeComps]
    } else {
      this.usedNativeComps = Array.from<string>(componentConfig.includes).filter(name => this.nativeComps.includes(name))
    }

    const elements = this.usedNativeComps.reduce((str, name) => str + `<element name="taro-${name}" src="./components-harmony/${name}/index.hml"></element>\n`, '')

    return `<element name="container" src="./index.hml"></element>
${elements}

<block for="{{i in root.cn}}">
`
  }

  buildTemplate = (componentConfig) => {
    let template = this.buildHeaderTemplate(componentConfig)

    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(this.internalComponents)
    }
    const ZERO_FLOOR = 0
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    template = components.reduce((current, nodeName) => {
      const attributes = this.miniComponents[nodeName]
      return current + this.buildComponentTemplate({ nodeName, attributes }, ZERO_FLOOR)
    }, template)

    template += this.buildPlainTextTemplate()

    template += '\n</block>'

    return template
  }

  buildFocusComponentTemplte (comp): string {
    const children = this.voidElements.has(comp.nodeName) ? '' : '<container root="{{i}}"></container>'

    let nodeName = ''

    if (this.nativeComps.includes(comp.nodeName)) {
      nodeName = `taro-${comp.nodeName}`
      // 鸿蒙自定义组件不能传 class 属性
      comp.attributes.cls = comp.attributes.class
      delete comp.attributes.class
    }

    const res = `
<block if="{{i.nn == '${comp.nodeName}'}}">
  <${nodeName} ${this.buildAttrs(comp.attributes, comp.nodeName)} id="{{i.uid}}">
    ${children}
  </${nodeName}>
</block>
`
    return res
  }

  buildStandardComponentTemplate (comp) {
    const children = this.voidElements.has(comp.nodeName) ? '' : '<container root="{{i}}"></container>'

    let nodeName = ''
    switch (comp.nodeName) {
      case 'slot':
      case 'slot-view':
      case 'catch-view':
      case 'static-view':
      case 'pure-view':
      case 'view':
      case 'swiper-item':
        nodeName = 'div'
        break
      case 'static-text':
        nodeName = 'text'
        break
      case 'static-image':
        nodeName = 'image'
        break
      default:
        nodeName = comp.nodeName
        break
    }

    if (this.nativeComps.includes(nodeName)) {
      nodeName = `taro-${nodeName}`
      // 鸿蒙自定义组件不能传 class 属性
      comp.attributes.cls = comp.attributes.class
      delete comp.attributes.class
    }

    const res = `
<block if="{{i.nn == '${comp.nodeName}'}}">
  <${nodeName} ${this.buildAttrs(comp.attributes, comp.nodeName)} id="{{i.uid}}">
    ${children}
  </${nodeName}>
</block>
`

    return res
  }

  buildPlainTextTemplate (): string {
    return `
<block if="{{i.nn === '#text'}}">
  <span>{{i.${Shortcuts.Text}}}</span>
</block>
`
  }

  buildAttrs (attrs, nodeName) {
    return Object.keys(attrs)
      .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? attrs[k] : `{${this.getAttrValue(attrs[k], k, nodeName)}}`}" `)
      .join('')
  }

  replacePropName (name: string, value: string, _componentName?: string) {
    if (value === 'eh') return name.toLowerCase().replace(/^bind/, '@')
    // 由于鸿蒙不支持for属性 需要修改for属性，需要改名
    if (_componentName === 'label' && name === 'for') return 'target'
    return name
  }

  getEvents (): any {
    return {
      '@click': 'eh'
    }
  }

  buildPageTemplate = (baseTempPath: string) => {
    const containerPath = path.join(path.dirname(baseTempPath), 'container')
    const containerTempPath = path.join(containerPath, 'index.hml')
    const navbarTempPath = path.join(containerPath, 'components-harmony/navbar/index.hml')
    const tabbarTempPath = path.join(containerPath, 'components-harmony/tabbar/index.hml')
    const template = `<element name="container" src="${containerTempPath}"></element>
<element name="navbar" src="${navbarTempPath}"></element>
<element name="tabbar" src="${tabbarTempPath}"></element>

<div class="container">
  <navbar title="{{taroNavBar.title}}" background="{{taroNavBar.background}}" text-style="{{taroNavBar.textStyle}}" st="{{taroNavBar.style}}"></navbar>
  <div class="body" style="padding-top: 44px;padding-bottom: {{isShowTaroTabBar ? '56px' : '0'}}">
    <container root="{{root}}"></container>
  </div>
  <tabbar if="{{isShowTaroTabBar}}" data="{{taroTabBar}}" selected="{{selected}}"></tabbar>
</div>
`

    return template
  }
}
