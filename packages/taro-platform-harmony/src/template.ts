import { fs } from '@tarojs/helper'
import { getComponentsAlias } from '@tarojs/shared'
import { Attributes, RecursiveTemplate, Shortcuts } from '@tarojs/shared/dist/template'
import path from 'path'

interface Component {
  nodeName: string
  nodeAlias: string
  attributes: Attributes
}

interface Components {
  [key: string]: Record<string, string>
}

interface ComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<string, Set<string>>
  includeAll: boolean
}

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

  patchVoidElements: string[] = [
    'button',
    'image',
    'camera',
    'video',
    'web-view',
    'picker',
    'checkbox',
    'rich-text'
  ]

  constructor () {
    super()

    const compsDir = path.resolve(__dirname, 'components', 'components-harmony')
    this.patchVoidElements.forEach(item => {
      this.voidElements.add(item)
    })

    this.nativeComps = fs.readdirSync(compsDir).filter(name => fs.pathExistsSync(path.resolve(compsDir, name, 'index.hml')))
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

<block>
`
  }

  createMiniComponents (components: Components) {
    components.Button.cn = ''
    components.Button.bindtap = ''
    components.Button.type = "'default'"

    const result: Components = super.createMiniComponents(components)

    delete result['pure-view']
    delete result['static-view']
    delete result['static-text']
    delete result['static-image']

    return result
  }

  buildTemplate = (componentConfig: ComponentConfig) => {
    let template = this.buildHeaderTemplate(componentConfig)

    if (!this.miniComponents) {
      this.componentsAlias = getComponentsAlias(this.internalComponents)
      this.miniComponents = this.createMiniComponents(this.internalComponents)
    }
    const ZERO_FLOOR = 0
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    template = components.reduce((current, nodeName) => {
      const attributes: Attributes = this.miniComponents[nodeName]
      const nodeAlias = this.componentsAlias[nodeName]._num
      return current + this.buildComponentTemplate({ nodeName, nodeAlias, attributes }, ZERO_FLOOR)
    }, template)

    template += this.buildPlainTextTemplate()

    template += '\n</block>'

    return template
  }

  buildFocusComponentTemplate (comp: Component): string {
    return this.generateComponentTemplateSrc(comp)
  }

  buildStandardComponentTemplate (comp: Component) {
    let nodeName = ''
    switch (comp.nodeName) {
      case 'slot':
      case 'slot-view':
      case 'cover-view':
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
    return this.generateComponentTemplateSrc(comp, nodeName)
  }

  generateComponentTemplateSrc (comp: Component, nodeName?): string {
    const nodeAlias = comp.nodeAlias
    const children = this.voidElements.has(comp.nodeName)
      ? ''
      : `<block for="{{i.cn}}">
      <container i="{{$item}}"></container>
    </block>`
    if (!nodeName) {
      nodeName = comp.nodeName
    }
    if (this.nativeComps.includes(nodeName)) {
      nodeName = `taro-${nodeName}`
    }

    const res = `
<block if="{{i.nn == '${nodeAlias}'}}">
  <${nodeName} ${this.buildAttrs(comp.attributes, comp.nodeName)} id="{{i.uid||i.sid}}" data-sid="{{i.sid}}">
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

  replacePropName (name: string, value: string, componentName?: string) {
    if (value === 'eh') return name.toLowerCase().replace(/^bind/, '@')
    // 由于鸿蒙不支持for属性 需要修改for属性，需要改名
    if (componentName === 'label' && name === 'for') return 'target'
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
  <navbar if="{{taroNavBar}}" title="{{taroNavBar.title}}" background="{{taroNavBar.background}}" text-style="{{taroNavBar.textStyle}}" st="{{taroNavBar.style}}"></navbar>
  <div class="body" style="padding-top: 44vp;padding-bottom: {{isShowTaroTabBar ? '56vp' : '0'}}">
    <refresh if="{{enablePullDownRefresh}}" type="pulldown" refreshing="{{isRefreshing}}" onrefresh="onPullDownRefresh">
      <block for="{{root.cn}}">
        <container i="{{$item}}"></container>
      </block>
    </refresh>
    <block else for="{{root.cn}}">
      <container i="{{$item}}"></container>
    </block>
  </div>
  <tabbar if="{{isShowTaroTabBar}}" tabbar-data="{{taroTabBar}}" selected="{{selected}}"></tabbar>
</div>
`

    return template
  }
}
