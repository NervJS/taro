import { internalComponents, Shortcuts, createMiniComponents } from '@tarojs/shared'
import { Adapter } from './adapters'

const miniComponents = createMiniComponents(internalComponents)

interface Component {
  nodeName: string;
  attributes: Attributes;
}

type Attributes = Record<string, string>

function buildAttribute (attrs: Attributes): string {
  return Object.keys(attrs)
    .map(k => `${k}="${k.startsWith('bind') ? attrs[k] : `{{ ${attrs[k]} }}`}" `)
    .join('')
}

function buildStandardComponentTemplate (comp: Component, level: number): string {
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <${comp.nodeName} ${buildAttribute(comp.attributes)} id="{{ i.uid }}">
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      <template is="tmpl_${level + 1}_${Shortcuts.Container}" data="{{i: item}}" />
    </block>
  </${comp.nodeName}>
</template>
`
}

const controlledComponent = new Set([
  'input',
  'checkbox',
  'picker-view',
  'radio',
  'slider',
  'textarea'
])

// 各种小程序类 js 语法
function buildXsTemplate () {
  return `
<wxs module="xs">
  module.exports = {
    c: function(i, prefix) {
      var s = '_' + i.value !== undefined ? 'controlled' : 'uncontrolled'
      return prefix + i.${Shortcuts.NodeName} + '_' + s
    }
  }
</wxs>
`
}

function buildComponentTemplate (comp: Component, level: number) {
  return controlledComponent.has(comp.nodeName)
    ? buildControlledComponentTemplte(comp, level)
    : buildStandardComponentTemplate(comp, level)
}

function buildControlledComponentTemplte (comp: Component, level: number) {
  const attrs = { ...comp.attributes }
  delete attrs.value
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <template is="{{ xs.c(i, 'tmpl_${level}_') }}" data="{{i: i}}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_controlled">
  <${comp.nodeName} ${buildAttribute(comp.attributes)} id="{{ i.uid }}">
  <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
    <template is="tmpl_${level + 1}_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
  </${comp.nodeName}>
</template>

<template name="tmpl_${level}_${comp.nodeName}_uncontrolled">
  <${comp.nodeName} ${buildAttribute(attrs)} id="{{ i.uid }}">
  <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
    <template is="tmpl_${level + 1}_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
  </${comp.nodeName}>
</template>
`
}

function buildPlainTextTemplate (level: number): string {
  return `
<template name="tmpl_${level}_#text" data="{{i: i}}">
  <block>{{i.${Shortcuts.Text}}}</block>
</template>
`
}

function buildContainerTemplate (level: number) {
  return `
<template name="tmpl_${level}_${Shortcuts.Container}" data="{{i: i}}">
  <template is="{{'tmpl_${level}_' + i.${Shortcuts.NodeName}}}" data="{{i: i}}" />
</template>
`
}

function buildTemplate (level: number) {
  const components = Object.keys(miniComponents)
  let template = ''

  for (const nodeName of components) {
    const attributes: Attributes = miniComponents[nodeName]
    template += buildComponentTemplate({ nodeName, attributes }, level)
  }

  template += buildPlainTextTemplate(level)
  template += buildContainerTemplate(level)

  return template
}

export function buildBaseTemplate (level: number) {
  let template = `${buildXsTemplate()}
<template name="taro_tmpl">
  <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="{{id}}">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
</template>
`

  for (let i = 0; i < level; i++) {
    template += buildTemplate(i)
  }

  return template
}

export function buildPageTemplate () {
  const template = `<import src="../../base.wxml"/>
  <template is="taro_tmpl" data="{{root: root}}" />`

  return template
}
