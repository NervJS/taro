import { ComponentConfig, Attributes, RecursiveTemplate, toCamelCase, capitalize } from '@tarojs/shared'
import * as componentTagNames from './components-react'

export class Template extends RecursiveTemplate {
  Adapter = {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    for: 'for',
    forItem: '',
    forIndex: '',
    key: 'tid',
    xs: '',
    type: 'quickapp'
  }

  protected replacePropName (name, value) {
    name = name.toLowerCase()
    if (name === 'bindlongtap') return 'onlongpress'
    if (value === 'eh') return name.toLowerCase().replace('bind', 'on')
    return name
  }

  protected getEvents () {
    return {
      onclick: 'eh',
      ontouchstart: 'eh',
      ontouchmove: 'eh',
      ontouchend: 'eh',
      ontouchcancel: 'eh',
      onlongpress: 'eh'
    }
  }

  public buildTemplate = (componentConfig: ComponentConfig) => {
    const Adapter = this.Adapter
    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(this.internalComponents)
    }
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    const mergedAttributes = components.reduce<Attributes>((current, nodeName) => {
      const attributes = this.miniComponents[nodeName]
      return Object.assign(current, attributes)
    }, {})
    const attributesStr = Object.keys(mergedAttributes)
      .map(k => {
        return `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? mergedAttributes[k] : `{{${mergedAttributes[k]}}}`}"`
      })
      .join(' ')

    const getNodeNameStr = "(i.nn === 'slot-view' || i.nn === 'catch-view' || i.nn === 'static-view' || i.nn === 'pure-view' ? 'view' : i.nn === 'static-text' ? 'text' : i.nn === 'static-image' ? 'image' : i.nn)"
    const isTextNodeStr = "(i.nn === 'static-text' || i.nn === 'text')"
    const isNestedTextStr = `(${isTextNodeStr} && parentIsText)`

    const template = `
<import name="base" src="./base"></import>
<template>
  <block>
    <span ${Adapter.if}="i.nn === '#text' && parentIsText">{{i.v}}</span>
    <text ${Adapter.elseif}="i.nn === '#text' && !parentIsText">{{i.v}}</text>
    <component ${Adapter.else} is="{{${isNestedTextStr} ? 'span' : ${getNodeNameStr}}}" id="{{i.uid}}" ${attributesStr}>
      <block ${Adapter.for}="{{i.cn}}" ${Adapter.key}="uid">
        <base i="{{$item}}" parent-is-text="{{${isTextNodeStr}}}"></base>
      </block>
    </component>
  </block>
</template>
`

    const taroSelfComponents = components.map(name => {
      name = capitalize(toCamelCase(name))
      return componentTagNames[name]
    }).filter(Boolean)

    return [template, taroSelfComponents] as any
  }

  public buildPageTemplate = (_baseTempPath: string) => {
    const Adapter = this.Adapter

    const template = `
<import name="base" src="./base"></import>
<template>
  <div id="taro-page">
    <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="uid">
      <base i="{{$item}}"></base>
    </block>
  </div>
</template>
`

    return template
  }

  public buildCustomComponentTemplate = (_: string) => {
    throw new Error('快应用不需要生成custom-wrapper')
  }
}
