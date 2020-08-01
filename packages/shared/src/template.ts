/**
 * 这里我们需要关心的小程序种类有两类：
 * 1. 模板递归：
 *  - 支持：tmpl0 套 tmpl0
 *  - 不支持：这就使得我们必须生成多级的模板，tmpl0 套 tmpl1，tmpl1 套 tmpl2……
 *           直到超过阈值 N (N = config.miniapp.baseLevel) tmplN 会套组件 comp，组件 comp 重新再套 tmpl0。
 * 2. 小程序脚本语言（wxs, sjs, etc...）：
 *  - 支持：可以在模板使用函数缩减模板大小或提高性能（存疑），例如判断一个值是不是假值（falsy value）。
 *         将来或许会把数据序列化^1 的操作也放到小程序脚本语言里。
 *  - 不支持：使用纯 *xml 语法
 *
 * ^1: packages/taro-runtime/src/hydrate.ts
*/

import {
  internalComponents,
  focusComponents,
  styles,
  events,
  specialEvents,
  singleQuote
} from './components'
import { Shortcuts } from './shortcuts'
import { isBooleanStringLiteral, isNumber, isFunction } from './is'
import { toCamelCase, toDashed, hasOwn } from './utils'

interface Component {
  nodeName: string;
  attributes: Attributes;
}

interface Components {
  [key: string]: Record<string, string>;
}

interface ComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<string, Set<string>>
  includeAll: boolean
}

export interface IAdapter {
  if: string;
  else: string;
  elseif: string;
  for: string;
  forItem: string;
  forIndex: string;
  key: string;
  xs?: string,
  type: string;
}

export type Attributes = Record<string, string>

const voidElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'audio',
  'live-player',
  'live-pusher',
  'video'
])

const weixinAdapter: IAdapter = {
  if: 'wx:if',
  else: 'wx:else',
  elseif: 'wx:elif',
  for: 'wx:for',
  forItem: 'wx:for-item',
  forIndex: 'wx:for-index',
  key: 'wx:key',
  xs: 'wxs',
  type: 'weapp'
}

export class BaseTemplate {
  protected exportExpr = 'module.exports ='
  protected isSupportRecursive: boolean
  protected supportXS = false
  protected miniComponents: Components
  protected modifyTemplateChild?: (child: string, nodeName: string) => string
  protected modifyTemplateChildren?: (children: string, nodeName: string) => string
  protected modifyTemplateResult?: (res: string, nodeName: string, level: number, children: string) => string

  public Adapter = weixinAdapter

  private buildAttribute (attrs: Attributes, nodeName: string): string {
    return Object.keys(attrs)
      .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') ? attrs[k] : `{${this.getAttrValue(attrs[k], k, nodeName)}}`}" `)
      .join('')
  }

  protected replacePropName (name: string, value: string, _componentName?: string) {
    if (value === 'eh') return name.toLowerCase()
    return name
  }

  protected createMiniComponents (components: Components) {
    const result: Components = Object.create(null)

    for (const key in components) {
      if (hasOwn(components, key)) {
        const component = components[key]
        const compName = toDashed(key)
        const newComp: Record<string, string> = Object.create(null)
        for (let prop in component) {
          if (hasOwn(component, prop)) {
            let propValue = component[prop]
            if (prop.startsWith('bind') || specialEvents.has(prop)) {
              propValue = 'eh'
            } else if (propValue === '') {
              propValue = `i.${toCamelCase(prop)}`
            } else if (isBooleanStringLiteral(propValue) || isNumber(+propValue)) {
              propValue = `i.${toCamelCase(prop)} === undefined ? ${propValue} : i.${toCamelCase(prop)}`
            } else {
              propValue = `i.${toCamelCase(prop)} || ${propValue || singleQuote('')}`
            }

            prop = this.replacePropName(prop, propValue, compName)

            newComp[prop] = propValue
          }
        }
        if (compName !== 'block') {
          Object.assign(newComp, styles, this.getEvents())
        }

        if (compName === 'slot' || compName === 'slot-view') {
          result[compName] = {
            slot: 'i.name'
          }
        } else {
          result[compName] = newComp
        }
      }
    }

    return result
  }

  protected buildBaseTemplate () {
    const Adapter = this.Adapter

    return `${this.buildXsTemplate()}
<template name="taro_tmpl">
  <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="id">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{${this.dataKeymap('i: item')}}}" />
  </block>
</template>
`
  }

  protected buildThirdPartyAttr (attrs: Set<string>) {
    return Array.from(attrs).reduce((str, attr) => {
      if (attr.startsWith('@')) { // vue event
        return str + `bind${attr.slice(1)}="eh" `
      } else if (attr.startsWith('bind')) {
        return str + `${attr}="eh" `
      } else if (attr.startsWith('on')) {
        return str + `bind${attr.slice(2).toLowerCase()}="eh" `
      }

      return str + `${attr}="{{ i.${toCamelCase(attr)} }}" `
    }, '')
  }

  protected buildComponentTemplate (comp: Component, level: number) {
    return focusComponents.has(comp.nodeName)
      ? this.buildFocusComponentTemplte(comp, level)
      : this.buildStandardComponentTemplate(comp, level)
  }

  protected buildFocusComponentTemplte (comp: Component, level: number) {
    const attrs = { ...comp.attributes }
    const templateName = this.supportXS
      ? `xs.c(i, 'tmpl_${level}_')`
      : `i.focus ? 'tmpl_${level}_${comp.nodeName}_focus' : 'tmpl_${level}_${comp.nodeName}_blur'`
    delete attrs.focus
    return `
<template name="tmpl_${level}_${comp.nodeName}">
  <template is="{{ ${templateName} }}" data="{{${this.dataKeymap('i: i')}}}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_focus">
  <${comp.nodeName} ${this.buildAttribute(comp.attributes, comp.nodeName)} id="{{ i.uid }}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_blur">
  <${comp.nodeName} ${this.buildAttribute(attrs, comp.nodeName)} id="{{ i.uid }}" />
</template>
`
  }

  protected buildStandardComponentTemplate (comp: Component, level: number) {
    const { isSupportRecursive, Adapter } = this
    const nextLevel = isSupportRecursive ? 0 : level + 1

    let child = `<template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{${this.dataKeymap('i: item')}}}" />`

    if (isFunction(this.modifyTemplateChild)) {
      child = this.modifyTemplateChild(child, comp.nodeName)
    }

    let children = voidElements.has(comp.nodeName)
      ? ''
      : `
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      ${child}
    </block>
  `

    if (isFunction(this.modifyTemplateChildren)) {
      children = this.modifyTemplateChildren(children, comp.nodeName)
    }

    const nodeName = comp.nodeName === 'slot' || comp.nodeName === 'slot-view' ? 'view' : comp.nodeName

    let res = `
<template name="tmpl_${level}_${comp.nodeName}">
  <${nodeName} ${this.buildAttribute(comp.attributes, comp.nodeName)} id="{{ i.uid }}">${children}</${nodeName}>
</template>
`

    if (isFunction(this.modifyTemplateResult)) {
      res = this.modifyTemplateResult(res, comp.nodeName, level, children)
    }

    return res
  }

  protected buildPlainTextTemplate (level: number): string {
    return `
<template name="tmpl_${level}_#text" data="{{${this.dataKeymap('i: i')}}}">
  <block>{{i.${Shortcuts.Text}}}</block>
</template>
`
  }

  protected buildThirdPartyTemplate (level: number, componentConfig: ComponentConfig) {
    const { Adapter, isSupportRecursive } = this
    const nextLevel = isSupportRecursive ? 0 : level + 1
    let template = ''

    componentConfig.thirdPartyComponents.forEach((attrs, compName) => {
      template += `
<template name="tmpl_${level}_${compName}">
  <${compName} ${this.buildThirdPartyAttr(attrs)} id="{{ i.uid }}">
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      <template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{${this.dataKeymap('i: item')}}}" />
    </block>
  </${compName}>
</template>
  `
    })

    return template
  }

  protected buildContainerTemplate (level: number, restart = false) {
    let tmpl = ''
    if (restart) {
      tmpl = '<comp i="{{i}}" />'
    } else {
      tmpl = `<template is="{{'tmpl_${level}_' + i.${Shortcuts.NodeName}}}" data="{{${this.dataKeymap('i: i')}}}" />`
    }
    return `
<template name="tmpl_${level}_${Shortcuts.Container}" data="{{${this.dataKeymap('i: i')}}}">
  ${tmpl}
</template>
`
  }

  protected dataKeymap (keymap: string) {
    return keymap
  }

  protected getEvents (): any {
    return events
  }

  protected getAttrValue (value: string, _key: string, _nodeName: string) {
    return `{ ${value} }`
  }

  protected buildXsTemplate () {
    return ''
  }

  public buildPageTemplate = (baseTempPath: string) => {
    const template = `<import src="${baseTempPath}"/>
  <template is="taro_tmpl" data="{{${this.dataKeymap('root: root')}}}" />`

    return template
  }

  public buildBaseComponentTemplate = () => {
    return `<import src="./base.wxml" />
  <template is="tmpl_0_container" data="{{${this.dataKeymap('i: i')}}}" />`
  }

  public buildXScript = () => {
    return `${this.exportExpr} {
    c: function(i, prefix) {
      var s = i.focus !== undefined ? 'focus' : 'blur'
      return prefix + i.${Shortcuts.NodeName} + '_' + s
    },
    d: function (i, v) {
      return i === undefined ? v : i
    }
  }`
  }
}

export class RecursiveTemplate extends BaseTemplate {
  isSupportRecursive = true

  public buildTemplate = (componentConfig: ComponentConfig) => {
    let template = this.buildBaseTemplate()
    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(internalComponents)
    }
    const ZERO_FLOOR = 0
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    template = components.reduce((current, nodeName) => {
      const attributes: Attributes = this.miniComponents[nodeName]
      return current + this.buildComponentTemplate({ nodeName, attributes }, ZERO_FLOOR)
    }, template)

    template += this.buildPlainTextTemplate(ZERO_FLOOR)
    template += this.buildThirdPartyTemplate(ZERO_FLOOR, componentConfig)
    template += this.buildContainerTemplate(ZERO_FLOOR)

    return template
  }
}

export class UnRecursiveTemplate extends BaseTemplate {
  isSupportRecursive = false
  private _baseLevel = 16

  set baseLevel (lv) {
    this._baseLevel = lv
  }

  get baseLevel () {
    return this._baseLevel
  }

  public buildTemplate = (componentConfig: ComponentConfig) => {
    let template = this.buildBaseTemplate()
    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(internalComponents)
    }
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    for (let i = 0; i < this.baseLevel; i++) {
      template += this.buildFloor(i, components, componentConfig, this.baseLevel === i + 1)
    }

    return template
  }

  protected buildFloor (level: number, components: string[], componentConfig: ComponentConfig, restart = false) {
    let template = components.reduce((current, nodeName) => {
      const attributes: Attributes = this.miniComponents[nodeName]
      return current + this.buildComponentTemplate({ nodeName, attributes }, level)
    }, '')

    template += this.buildPlainTextTemplate(level)
    template += this.buildThirdPartyTemplate(level, componentConfig)
    template += this.buildContainerTemplate(level, restart)

    return template
  }
}
