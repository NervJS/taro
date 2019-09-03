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

function buildStandardComponentTemplate (comp: Component, index: number): string {
  return `
<template name="tmpl_${index}_${comp.nodeName}">
  <${comp.nodeName} ${buildAttribute(comp.attributes)}>
    <block ${Adapter.for}="{{i.${Shortcuts.Childnodes}}}" ${Adapter.key}="{{id}}">
      <template is="tmpl_${index + 1}_${Shortcuts.Container}" data="{{i: item}}" />
    </block>
  </${comp.nodeName}>
</template>
`
}

function buildPlainTextTemplate (index: number): string {
  return `
<template name="tmpl_${index}_plain-text" data="{{i: i}}">
  <block>{{i.${Shortcuts.Text}}}</block>
</template>
`
}

function buildContainerTemplate (index: number) {
  return `
<template name="tmpl_${index}_${Shortcuts.Container}" data="{{i: i}}">
  <template is="{{'tmpl_${index}_' + i.${Shortcuts.NodeType}}}" data="{{i: i}}" />
</template>  
`
}

function buildTemplate (index: number) {
  const components = Object.keys(standComponents)
  let template = ''

  for (const nodeName of components) {
    const attributes: Attributes = standComponents[nodeName]
    template += buildStandardComponentTemplate({ nodeName, attributes }, index)
  }

  template += buildPlainTextTemplate(index)
  template += buildContainerTemplate(index)

  return template
}

export function buildTemplates (level: number) {
  let template = `<template name="taro_tmpl">
  <block ${Adapter.for}="{{tree.root.children}}" ${Adapter.key}="{{id}}">
    <template is="tmpl_0_${Shortcuts.Container}" data="{{i: item}}" />
  </block>
</template>
`

  for (let i = 0; i < level; i++) {
    template += buildTemplate(i)
  }

  return template
}
