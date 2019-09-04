import { Shortcuts } from './shortcuts'
import { standComponents } from './component'
import { Adapter } from './adapters'

interface Component {
  nodeName: string;
  attributes: Attributes;
}

type Attributes = Record<string, string>

function buildAttribute (attrs: Attributes): string {
  return Object.keys(attrs).map(k => `${k}="{{ ${attrs[k]} }}" `).join('')
}

function buildStandardComponentTemplate (comp: Component, level: number): string {
  return `
<template name="tmpl_${level}_${comp.nodeName}">
  <${comp.nodeName} ${buildAttribute(comp.attributes)}>
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="{{id}}">
      <template is="tmpl_${level + 1}_${Shortcuts.Container}" data="{{i: item}}" />
    </block>
  </${comp.nodeName}>
</template>
`
}

function buildPlainTextTemplate (level: number): string {
  return `
<template name="tmpl_${level}_${Shortcuts.PlainText}" data="{{i: i}}">
  <block>{{i.${Shortcuts.Text}}}</block>
</template>
`
}

function buildContainerTemplate (level: number) {
  return `
<template name="tmpl_${level}_${Shortcuts.Container}" data="{{i: i}}">
  <template is="{{'tmpl_${level}_' + i.${Shortcuts.NodeType}}}" data="{{i: i}}" />
</template>
`
}

function buildTemplate (level: number) {
  const components = Object.keys(standComponents)
  let template = ''

  for (const nodeName of components) {
    const attributes: Attributes = standComponents[nodeName]
    template += buildStandardComponentTemplate({ nodeName, attributes }, level)
  }

  template += buildPlainTextTemplate(level)
  template += buildContainerTemplate(level)

  return template
}

export function buildTemplates (level: number) {
  let template = `<template name="taro_tmpl">
  <block ${Adapter.for}="{{root}}" ${Adapter.key}="{{id}}">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
</template>
`

  for (let i = 0; i < level; i++) {
    template += buildTemplate(i)
  }

  return template
}
