import { Shortcuts } from '@tarojs/shared'

interface MiniData {
  [Shortcuts.Childnodes]?: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
  [Shortcuts.Text]?: string
  uid: string
}

export class Prerender {
  buildXML (data: MiniData) {
    const nodeName = data[Shortcuts.NodeName]

    if (nodeName === '#text') {
      return data[Shortcuts.Text]
    }

    const style = data[Shortcuts.Style]
    const klass = data[Shortcuts.Class]
    const children = data[Shortcuts.Childnodes] ?? []

    return `<${nodeName}${style ? ` style="${style}"` : ''}${klass ? ` class="${klass}"` : ''}>
    ${children.map(this.buildXML).join('')}
</${nodeName}>`
  }

  writeXML () {
    return ''
  }
}
