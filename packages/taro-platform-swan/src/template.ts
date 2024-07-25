import { indent, isArray, Shortcuts } from '@tarojs/shared'
import { RecursiveTemplate } from '@tarojs/shared/dist/template'

// c => Shortcuts.Childnodes
// s => Shortcuts.Sid
const REG_TRACKBY_REPLACEMENT = /s-for="{{([A-Za-z]+)\.c}}" s-key="s"/

const swanSpecialAttrs = {
  'scroll-view': ['scroll-top', 'scroll-left', 'scroll-into-view'],
  'movable-view': ['x', 'y'],
  input: ['value'],
  textarea: ['value']
}

interface TemplateOptions {
  flattenViewLevel?: number
  flattenCoverLevel?: number
  flattenTextLevel?: number
}

export class Template extends RecursiveTemplate {
  supportXS = true
  isXMLSupportRecursiveReference = false

  Adapter = {
    if: 's-if',
    else: 's-else',
    elseif: 's-elif',
    for: 's-for',
    forItem: 's-for-item',
    forIndex: 's-for-index',
    key: 's-key',
    xs: 'sjs',
    type: 'swan'
  }

  flattenViewLevel: number
  flattenCoverLevel: number
  flattenTextLevel: number

  legacyMiniComponents: {
    [key: string]: Record<string, string>
  }

  constructor (options?: TemplateOptions) {
    super()
    this.flattenViewLevel = options?.flattenViewLevel ?? 8
    this.flattenCoverLevel = options?.flattenCoverLevel ?? 3
    this.flattenTextLevel = options?.flattenTextLevel ?? 3
  }

  protected buildBaseTemplate () {
    const rootTmpl = super.buildBaseTemplate()
    return rootTmpl.replace(REG_TRACKBY_REPLACEMENT, `s-for="$1.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}"`)
  }

  createMiniComponents (components): any {
    const result = super.createMiniComponents(components)

    this.legacyMiniComponents = { ...result }

    delete result['pure-view']
    delete result['static-view']
    delete result['catch-view']

    return result
  }

  buildXsTemplate (filePath = './utils') {
    return `<import-sjs module="xs" src="${filePath}.sjs" />`
  }

  dataKeymap (keymap: string) {
    return `{ ${keymap} }`
  }

  getAttrValue (value: string, key: string, nodeName: string) {
    if (isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
      return `= ${value} =`
    }

    return `{${value}}`
  }

  buildFlattenNodeAttributes (nodeName: string): string {
    const component = this.legacyMiniComponents[nodeName]

    return Object.keys(component)
      .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? component[k] : `{{${component[k].replace('i.', 'item.')}}}`}"`)
      .join(' ')
  }

  buildFlattenView = (level = this.flattenViewLevel): string => {
    if (level === 0) {
      return `<template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{i:item}}}" />`
    }

    const child = this.buildFlattenView(level - 1)

    const componentsAlias = this.componentsAlias
    const viewAlias = componentsAlias.view._num
    const textAlias = componentsAlias.text._num
    const staticTextAlias = componentsAlias['static-text']._num
    const buttonAlias = componentsAlias.button._num
    const inputAlias = componentsAlias.input._num
    const swiperAlias = componentsAlias.swiper._num

    const template =
`<view s-if="{{item.${Shortcuts.NodeName}==='${viewAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('view')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    ${indent(child, 4)}
  </block>
</view>
<text s-elif="{{item.${Shortcuts.NodeName}==='${textAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('text')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    <block>{{item.v}}</block>
  </block>
</text>
<text s-elif="{{item.${Shortcuts.NodeName}==='${staticTextAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('static-text')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    <block>{{item.v}}</block>
  </block>
</text>
<button s-elif="{{item.${Shortcuts.NodeName}==='${buttonAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('button')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{ i:item }}}" />
  </block>
</button>
<input s-elif="{{item.${Shortcuts.NodeName}==='${inputAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('input')} />
<swiper s-elif="{{item.${Shortcuts.NodeName}==='${swiperAlias}'&&(item.st||item.${Shortcuts.Class})}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('swiper')}>
  <block s-for="xs.f(item.${Shortcuts.Childnodes}) trackBy item.${Shortcuts.Sid}">
    <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{ i:item }}}" />
  </block>
</swiper>
<block s-else>
  <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{i:item}}}" />
</block>`

    return template
  }

  buildFlattenCover = (level = this.flattenCoverLevel): string => {
    if (level === 0) {
      return `<template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{i:item}}}" />`
    }

    const child = this.buildFlattenCover(level - 1)

    const componentsAlias = this.componentsAlias
    const coverViewAlias = componentsAlias['cover-view']._num
    const coverImageAlias = componentsAlias['cover-image']._num
    const contentAlias = componentsAlias['#text']._num

    const template =
`<cover-view s-if="{{item.${Shortcuts.NodeName}==='${coverViewAlias}'}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('cover-view')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    ${indent(child, 4)}
  </block>
</cover-view>
<cover-image s-elif="{{item.${Shortcuts.NodeName}==='${coverImageAlias}'}}" id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}"  ${this.buildFlattenNodeAttributes('cover-image')}></cover-image>
<block s-elif="{{item.${Shortcuts.NodeName}==='${contentAlias}'}}">{{item.v}}</block>
<block s-else>
  <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{{i:item}}}" />
</block>`

    return template
  }

  buildFlattenText = (level = this.flattenTextLevel): string => {
    if (level === 0) {
      return `<block>{{item.${Shortcuts.Text}}}</block>`
    }

    const child = this.buildFlattenText(level - 1)

    const componentsAlias = this.componentsAlias
    const contentAlias = componentsAlias['#text']._num

    const template =
`<block s-if="item.${Shortcuts.NodeName} === '${contentAlias}'">{{item.v}}</block>
<text s-else id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('text')}>
  <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
    ${indent(child, 4)}
  </block>
</text>`
    return template
  }

  modifyLoopBody = (child: string, nodeName: string): string => {
    const componentsAlias = this.componentsAlias
    const adAlias = componentsAlias.ad._num

    switch (nodeName) {
      case 'view':
        // fix issue #6015
        return this.buildFlattenView()

      case 'cover-view':
      case 'canvas':
      case 'map':
      case 'animation-view':
      case 'camera':
      case 'live-player':
        return this.buildFlattenCover()

      case 'video': {
        const body =
          `<ad s-if={{item.${Shortcuts.NodeName}==='${adAlias}'}} id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('ad')}></ad>
<block s-else>
  ${indent(this.buildFlattenCover(), 2)}
</block>`
        return body
      }

      case 'text':
      case 'static-text':
        return this.buildFlattenText()

      case 'picker-view':
        return `<picker-view-column id="{{item.uid||item.${Shortcuts.Sid}}}" data-${Shortcuts.Sid}="{{item.${Shortcuts.Sid}}}" ${this.buildFlattenNodeAttributes('picker-view-column')}>
          <block s-for="item.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}">
            ${child}
          </block>
        </picker-view-column>`

      default:
        return child
    }
  }

  modifyLoopContainer = (children: string, nodeName: string) => {
    if (nodeName === 'swiper') {
      // c => Shortcuts.Childnodes
      return children.replace(/s-for="{{i\.c}}"/, `s-for="xs.f(i.${Shortcuts.Childnodes}) trackBy item.${Shortcuts.Sid}"`)
    }

    return children.replace(REG_TRACKBY_REPLACEMENT, `s-for="$1.${Shortcuts.Childnodes} trackBy item.${Shortcuts.Sid}"`)
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column') return ''
    return res
  }

  buildXSTmpExtra () {
    const componentsAlias = this.componentsAlias
    const swiperAlias = componentsAlias['swiper-item']._num
    return `f: function (l) {
    return l.filter(function (i) {return i.${Shortcuts.NodeName} === '${swiperAlias}'})
  }`
  }
}
