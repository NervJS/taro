import { ComponentConfig, Attributes, RecursiveTemplate } from '@tarojs/shared'
import path from 'path'

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

    const template = `
    <import name="base" src="./base"></import>
    <template>
      <block>
        <text if="i.nn === '#text'">{{i.v}}</text>
        <component else is="{{quickappGetNodeName(i.nn)}}" id="{{i.uid}}" ${attributesStr}>
          <base ${Adapter.for}="{{i.cn}}" ${Adapter.key}="uid" i="{{$item}}"></base>
        </component>
      </block>
    </template>
    `

    const taroSelfComponents = components

    return [template, taroSelfComponents] as any
  }

  public buildPageTemplate = (baseTempPath: string) => {
    baseTempPath = baseTempPath.replace(path.extname(baseTempPath), '')
    const Adapter = this.Adapter

    const template = `<import name="base" src="${baseTempPath}"></import>
    <template>
      <div>
        <base ${Adapter.for}="{{root.cn}}" ${Adapter.key}="uid" i="{{$item}}"></base>
      </div>
    </template>
    `

    const taroSelfComponents = []

    return [template, taroSelfComponents] as any
  }

  public buildCustomComponentTemplate = (_: string) => {
    const Adapter = this.Adapter
    return `<template>
      <div>
        <base ${Adapter.for}="{{root.cn}}" ${Adapter.key}="uid" i="{{$item}}"></base>
      </div>
    </template>
    `
  }
}
