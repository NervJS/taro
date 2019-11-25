import { internalComponents, Shortcuts, createMiniComponents, controlledComponent } from '@tarojs/shared'
import { Adapter, supportXS } from './adapters'
import { BUILD_TYPES } from '../utils/constants'
import { componentConfig } from './component'

interface Component {
  nodeName: string;
  attributes: Attributes;
}

type Attributes = Record<string, string>

function buildAttribute (attrs: Attributes): string {
  return Object.keys(attrs)
    .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') ? attrs[k] : `{{ ${attrs[k]} }}`}" `)
    .join('')
}

function buildStandardComponentTemplate (comp: Component, level: number, supportRecursive: boolean): string {
  const nextLevel = supportRecursive ? 0 : level + 1
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <${comp.nodeName} ${buildAttribute(comp.attributes)} id="{{ i.uid }}">
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      <template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{i: item}}" />
    </block>
  </${comp.nodeName}>
</template>
`
}

// @TODO: 其它小程序的 XS 语法
function buildXsTemplate () {
  let xs = ''
  if (Adapter.type === BUILD_TYPES.WEAPP) {
    xs = `<wxs module="xs" src="./utils.${Adapter.xs}" />`
  } if (Adapter.type === BUILD_TYPES.SWAN || Adapter.type === BUILD_TYPES.ALIPAY) {
    xs = `<import-sjs name="xs" from="./utils.${Adapter.xs}" />`
  } else if (Adapter.type === BUILD_TYPES.QQ) {
    xs = `<qs module="xs" src="./utils.${Adapter.xs}" />`
  }
  return xs
}

export function buildXScript () {
  const exportExpr = Adapter.type === BUILD_TYPES.ALIPAY ? 'export default' : 'module.exports ='
  return `${exportExpr} {
  c: function(i, prefix) {
    var s = i.focus !== undefined ? 'focus' : 'blur'
    return prefix + i.${Shortcuts.NodeName} + '_' + s
  }
}`
}

function buildComponentTemplate (comp: Component, level: number, supportRecursive: boolean) {
  return controlledComponent.has(comp.nodeName)
    ? buildFocusComponentTemplte(comp, level, supportRecursive)
    : buildStandardComponentTemplate(comp, level, supportRecursive)
}

function buildFocusComponentTemplte (comp: Component, level: number, supportRecursive: boolean) {
  const attrs = { ...comp.attributes }
  const nextLevel = supportRecursive ? 0 : level + 1
  const templateName = supportXS()
    ? `xs.c(i, 'tmpl_${level}_')`
    : `i.focus ? 'tmpl_${level}_${comp.nodeName}_focus' : tmpl_${level}_${comp.nodeName}_blur }}`
  delete attrs.focus
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <template is="{{ ${templateName} }}" data="{{i: i}}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_focus">
  <${comp.nodeName} ${buildAttribute(comp.attributes)} id="{{ i.uid }}">
  <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
    <template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
  </${comp.nodeName}>
</template>

<template name="tmpl_${level}_${comp.nodeName}_blur">
  <${comp.nodeName} ${buildAttribute(attrs)} id="{{ i.uid }}">
  <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
    <template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{i: item}}" />
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

function buildContainerTemplate (level: number, restart = false) {
  let tmpl = ''
  if (restart) {
    tmpl = '<comp i="{{i}}" />'
  } else {
    tmpl = `<template is="{{'tmpl_${level}_' + i.${Shortcuts.NodeName}}}" data="{{i: i}}" />`
  }
  return `
<template name="tmpl_${level}_${Shortcuts.Container}" data="{{i: i}}">
  ${tmpl}
</template>
`
}

function buildTemplate (level: number, supportRecursive: boolean, restart = false) {
  const miniComponents = createMiniComponents(internalComponents, Adapter.type === BUILD_TYPES.ALIPAY)
  const components = Object.keys(miniComponents).filter(c => componentConfig.includes.size ? componentConfig.includes.has(c) : true)
  let template = ''

  for (const nodeName of components) {
    const attributes: Attributes = miniComponents[nodeName]
    template += buildComponentTemplate({ nodeName, attributes }, level, supportRecursive)
  }

  template += buildPlainTextTemplate(level)
  template += buildContainerTemplate(level, restart)

  return template
}

export function buildBaseTemplate (maxLevel: number, supportRecursive: boolean) {
  let template = `${buildXsTemplate()}
<template name="taro_tmpl">
  <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="{{id}}">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
</template>
`

  if (supportRecursive) {
    template += buildTemplate(0, supportRecursive)
  } else {
    for (let i = 0; i < maxLevel; i++) {
      template += buildTemplate(i, supportRecursive, maxLevel === i + 1)
    }
  }

  return template
}

export function buildPageTemplate (baseTempPath: string) {
  const template = `<import src="${baseTempPath}"/>
<template is="taro_tmpl" data="{{root: root}}" />`

  return template
}

export function buildBaseComponentTemplate () {
  return `<import src="./base.wxml" />
<template is="tmpl_0_container" data="{{i: i}}" />`
}
