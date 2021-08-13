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

  constructor (options?: TemplateOptions) {
    super()
    this.flattenViewLevel = options?.flattenViewLevel ?? 8
  }

  createMiniComponents (components): any {
    const result = super.createMiniComponents(components)

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

  buildFlattenView = (level = this.flattenViewLevel): string => {
    if (level === 0) {
      return '<template is="{{xs.e(0)}}" data="{{{i:item}}}" />'
    }

    const child = this.buildFlattenView(level - 1)

    const template =
`<view s-if="{{item.nn==='view'&&(item.st||item.cl)}}" hover-class="{{xs.b(item.hoverClass,'none')}}" hover-stop-propagation="{{xs.b(item.hoverStopPropagation,false)}}" hover-start-time="{{xs.b(item.hoverStartTime,50)}}" hover-stay-time="{{xs.b(item.hoverStayTime,400)}}" animation="{{item.animation}}" bindtouchstart="eh" bindtouchmove="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongtap="eh" bindanimationstart="eh" bindanimationiteration="eh" bindanimationend="eh" bindtransitionend="eh" style="{{item.st}}" class="{{item.cl}}" bindtap="eh" id="{{item.uid}}">
  <block s-for="{{item.cn}}" s-key="uid">
    ${indent(child, 4)}
  </block>
</view>
<block s-else>
  <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
</block>`

    return template
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'view') {
      // fix issue #6015
      return this.buildFlattenView()
    }

    if (nodeName === 'text' || nodeName === 'static-text') {
      return `<block>{{ i.${Shortcuts.Childnodes}[index].${Shortcuts.Text} }}</block>`
    }

    if (nodeName === 'picker-view') {
      return `<picker-view-column name="{{ item.name }}" style="{{ item.st }}" class="{{ item.cl }}" bindtap="eh"  id="{{item.uid}}">
        <block s-for="{{item.cn}}" s-key="uid">
          ${child}
        </block>
      </picker-view-column>`
    }

    if (nodeName === 'video') {
      const adComponent = this.miniComponents.ad

      const attributesStr = Object.keys(adComponent)
        .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? adComponent[k] : `{{${adComponent[k].replace('i.', 'item.')}}}`}" `)
        .join('')
      return `<ad s-if={{item.nn==='ad'}} ${attributesStr} id="{{item.uid}}"></ad>
          <template s-if={{item.nn!='ad'}} is="{{xs.e(0)}}" data="{{{ i:item }}}" />`
    }

    return child
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column') return ''
    return res
  }
}
