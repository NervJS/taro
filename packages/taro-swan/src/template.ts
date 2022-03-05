import { isArray, Shortcuts, indent } from '@tarojs/shared'
import { RecursiveTemplate } from '@tarojs/shared/dist/template'

const swanSpecialAttrs = {
  'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  'movable-view': ['x', 'y'],
  slider: ['value'],
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

  createMiniComponents (components): any {
    const result = super.createMiniComponents(components)

    this.legacyMiniComponents = { ...result }

    delete result['pure-view']
    delete result['static-view']

    return result
  }

  buildXsTemplate () {
    return '<import-sjs module="xs" src="./utils.sjs" />'
  }

  dataKeymap (keymap: string) {
    return `{ ${keymap} }`
  }

  getAttrValue (value: string, key: string, nodeName: string) {
    if (isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
      return `= ${value} =`
    }

    return `{ ${value} }`
  }

  buildFlattenNodeAttributes (nodeName: string): string {
    const component = this.legacyMiniComponents[nodeName]

    return Object.keys(component)
      .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? component[k] : `{{${component[k].replace('i.', 'item.')}}}`}"`)
      .join(' ')
  }

  buildFlattenView = (level = this.flattenViewLevel): string => {
    if (level === 0) {
      return '<template is="{{xs.e(0)}}" data="{{{i:item}}}" />'
    }

    const child = this.buildFlattenView(level - 1)

    const template =
`<view s-if="{{item.nn==='view'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('view')}>
  <block s-for="{{item.cn}}" s-key="sid">
    ${indent(child, 4)}
  </block>
</view>
<text s-elif="{{item.nn==='text'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('text')}>
  <block s-for="{{item.cn}}" s-key="sid">
    <block>{{item.v}}</block>
  </block>
</text>
<text s-elif="{{item.nn==='static-text'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('static-text')}>
  <block s-for="{{item.cn}}" s-key="sid">
    <block>{{item.v}}</block>
  </block>
</text>
<button s-elif="{{item.nn==='button'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('button')}>
  <block s-for="{{item.cn}}" s-key="sid">
    <template is="{{xs.e(0)}}" data="{{{ i:item }}}" />
  </block>
</button>
<input s-elif="{{item.nn==='input'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('input')} />
<swiper s-elif="{{item.nn==='swiper'&&(item.st||item.cl)}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('swiper')}>
  <block s-for="{{item.cn}}" s-key="sid">
    <template is="{{xs.e(0)}}" data="{{{ i:item }}}" />
  </block>
</swiper>
<block s-else>
  <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
</block>`

    return template
  }

  buildFlattenCover = (level = this.flattenCoverLevel): string => {
    if (level === 0) {
      return '<template is="{{xs.e(0)}}" data="{{{i:item}}}" />'
    }

    const child = this.buildFlattenCover(level - 1)

    const template =
`<cover-view s-if="{{item.nn==='cover-view'}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('cover-view')}>
  <block s-for="{{item.cn}}" s-key="sid">
    ${indent(child, 4)}
  </block>
</cover-view>
<cover-image s-elif="{{item.nn==='cover-image'}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}"  ${this.buildFlattenNodeAttributes('cover-image')}></cover-image>
<block s-elif="{{item.nn==='#text'}}">{{item.v}}</block>
<block s-else>
  <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
</block>`

    return template
  }

  buildFlattenText = (level = this.flattenTextLevel): string => {
    if (level === 0) {
      return `<block>{{i.${Shortcuts.Childnodes}[index].${Shortcuts.Text}}}</block>`
    }

    const child = this.buildFlattenText(level - 1)

    const template =
`<block s-if="item.nn === '#text'">{{item.v}}</block>
<text s-else id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('text')}>
  <block s-for="{{item.cn}}" s-key="sid">
    ${indent(child, 4)}
  </block>
</text>`
    return template
  }

  modifyLoopBody = (child: string, nodeName: string): string => {
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
          `<ad s-if={{item.nn==='ad'}} id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('ad')}></ad>
<block s-else>
  ${indent(this.buildFlattenCover(), 2)}
</block>`
        return body
      }

      case 'text':
      case 'static-text':
        return this.buildFlattenText()

      case 'picker-view':
        return `<picker-view-column id="{{item.uid||item.sid}}" data-sid="{{item.sid}}" ${this.buildFlattenNodeAttributes('picker-view-column')}>
          <block s-for="{{item.cn}}" s-key="sid">
            ${child}
          </block>
        </picker-view-column>`

      default:
        return child
    }
  }

  modifyLoopContainer = (children: string, nodeName: string) => {
    if (nodeName === 'swiper') {
      return children.replace(/s-for="{{i\.cn}}"/, 's-for="{{xs.f(i.cn)}}"')
    }

    return children
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column') return ''
    return res
  }

  buildXSTmpExtra () {
    return `f: function (l) {
    return l.filter(function (i) {return i.nn === 'swiper-item'})
  }`
  }
}
