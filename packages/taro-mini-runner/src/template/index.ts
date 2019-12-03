import { internalComponents, Shortcuts, createMiniComponents, focusComponents, isArray, capitalize } from '@tarojs/shared'
import { Adapter, supportXS } from './adapters'
import { BUILD_TYPES } from '../utils/constants'
import { componentConfig } from './component'

interface Component {
  nodeName: string;
  attributes: Attributes;
}

type Attributes = Record<string, string>

const voidElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'audio',
  'camera',
  'live-player',
  'live-pusher',
  'video'
])

const swanSpecialAttrs = {
  'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  'movable-view': ['x', 'y'],
  slider: ['value'],
  input: ['value'],
  textarea: ['value']
}

function buildAttribute (attrs: Attributes, nodeName: string): string {
  function getValue (key: string) {
    if (Adapter.type === BUILD_TYPES.SWAN && isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
      return `= ${attrs[key]} =`
    }

    return `{ ${attrs[key]} }`
  }
  return Object.keys(attrs)
    .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') ? attrs[k] : `{${getValue(k)}}`}" `)
    .join('')
}

const dataKeymap = (keymap: string) => {
  return Adapter.type === BUILD_TYPES.SWAN ? `{ ${keymap} }` : keymap
}

function buildStandardComponentTemplate (comp: Component, level: number, supportRecursive: boolean): string {
  const nextLevel = supportRecursive ? 0 : level + 1
  const child = Adapter.type === BUILD_TYPES.SWAN && comp.nodeName === 'text'
    ? `<block>{{ i.${Shortcuts.Childnodes}[index].${Shortcuts.Text} }}</block>`
    : `<template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{${dataKeymap('i: item')}}}" />`
  const children = voidElements.has(comp.nodeName)
    ? ''
    : `
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      ${child}
    </block>
  `
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <${comp.nodeName} ${buildAttribute(comp.attributes, comp.nodeName)} id="{{ i.uid }}">${children}</${comp.nodeName}>
</template>
`
}

function buildXsTemplate () {
  let xs = ''

  if (Adapter.type === BUILD_TYPES.WEAPP || Adapter.type === BUILD_TYPES.QQ) {
    xs = `<wxs module="xs" src="./utils.${Adapter.xs}" />`
  } else if (Adapter.type === BUILD_TYPES.ALIPAY) {
    xs = `<import-sjs name="xs" from="./utils.${Adapter.xs}" />`
  } else if (Adapter.type === BUILD_TYPES.SWAN) {
    xs = `<import-sjs module="xs" src="./utils.${Adapter.xs}" />`
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
  return focusComponents.has(comp.nodeName)
    ? buildFocusComponentTemplte(comp, level)
    : buildStandardComponentTemplate(comp, level, supportRecursive)
}

function buildFocusComponentTemplte (comp: Component, level: number) {
  const attrs = { ...comp.attributes }
  const templateName = supportXS()
    ? `xs.c(i, 'tmpl_${level}_')`
    : `i.focus ? 'tmpl_${level}_${comp.nodeName}_focus' : 'tmpl_${level}_${comp.nodeName}_blur'`
  delete attrs.focus
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <template is="{{ ${templateName} }}" data="{{${dataKeymap('i: i')}}}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_focus">
  <${comp.nodeName} ${buildAttribute(comp.attributes, comp.nodeName)} id="{{ i.uid }}" />
</template>

<template name="tmpl_${level}_${comp.nodeName}_blur">
  <${comp.nodeName} ${buildAttribute(attrs, comp.nodeName)} id="{{ i.uid }}" />
</template>
`
}

function buildPlainTextTemplate (level: number): string {
  return `
<template name="tmpl_${level}_#text" data="{{${dataKeymap('i: i')}}}">
  <block>{{i.${Shortcuts.Text}}}</block>
</template>
`
}

function buildContainerTemplate (level: number, restart = false) {
  let tmpl = ''
  if (restart) {
    tmpl = '<comp i="{{i}}" />'
  } else {
    tmpl = `<template is="{{'tmpl_${level}_' + i.${Shortcuts.NodeName}}}" data="{{${dataKeymap('i: i')}}}" />`
  }
  return `
<template name="tmpl_${level}_${Shortcuts.Container}" data="{{${dataKeymap('i: i')}}}">
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
  template += buildThirdPartyTemplate(level, supportRecursive)
  template += buildContainerTemplate(level, restart)

  return template
}

function buildThirdPartyAttr (attrs: Set<string>) {
  return [...attrs].reduce((str, attr) => {
    if (attr.startsWith('@')) { // vue event
      if (Adapter.type === BUILD_TYPES.ALIPAY) {
        return str + `on${capitalize(attr.slice(1))}="eh" `
      }
      return str + `bind${attr.slice(1)}="eh" `
    } else if (attr.startsWith('bind')) {
      return str + `${attr}="eh" `
    }
    return str + `${attr}="{{ i.${attr} }}" `
  }, '')
}

function buildThirdPartyTemplate (level: number, supportRecursive: boolean) {
  const nextLevel = supportRecursive ? 0 : level + 1
  let template = ''

  for (const [compName, attrs] of componentConfig.thirdPartyComponents) {
    template += `
<template name="tmpl_${level}_${compName}">
  <${compName} ${buildThirdPartyAttr(attrs)} id="{{ i.uid }}">
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="id">
      <template is="tmpl_${nextLevel}_${Shortcuts.Container}" data="{{${dataKeymap('i: item')}}}" />
    </block>
  </${compName}>
</template>
`
  }

  return template
}

export function buildBaseTemplate (maxLevel: number, supportRecursive: boolean) {
  let template = `${buildXsTemplate()}
<template name="taro_tmpl">
  <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="id">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{${dataKeymap('i: item')}}}" />
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
<template is="taro_tmpl" data="{{${dataKeymap('root: root')}}}" />`

  return template
}

export function buildBaseComponentTemplate () {
  return `<import src="./base.wxml" />
<template is="tmpl_0_container" data="{{${dataKeymap('i: i')}}}" />`
}
