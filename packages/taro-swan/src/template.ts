import { isArray, Shortcuts } from '@tarojs/shared'
import { RecursiveTemplate } from '@tarojs/shared/dist/template'

const swanSpecialAttrs = {
  'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  'movable-view': ['x', 'y'],
  slider: ['value'],
  input: ['value'],
  textarea: ['value']
}

export function buildFlattenView (depth = 16): string {
  if (depth === 0) {
    return '<template is="{{xs.e(0)}}" data="{{{i:item}}}" />'
  }

  const child = buildFlattenView(depth - 1)
    .split('\n')
    .map((line, index) => {
      const indent = index === 0 ? '' : Array(4).fill(' ').join('')
      return indent + line
    })
    .join('\n')

  const template =
`<view s-if="{{item.nn==='view'&&(item.st||item.cl)}}" hover-class="{{xs.b(item.hoverClass,'none')}}" hover-stop-propagation="{{xs.b(item.hoverStopPropagation,false)}}" hover-start-time="{{xs.b(item.hoverStartTime,50)}}" hover-stay-time="{{xs.b(item.hoverStayTime,400)}}" animation="{{item.animation}}" bindtouchstart="eh" bindtouchmove="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongtap="eh" bindanimationstart="eh" bindanimationiteration="eh" bindanimationend="eh" bindtransitionend="eh" style="{{item.st}}" class="{{item.cl}}" bindtap="eh" id="{{item.uid}}">
  <block s-for="{{item.cn}}" s-key="uid">
    ${child}
  </block>
</view>
<block s-else>
  <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
</block>`

  return template
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

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'view') {
      // fix issue #6015
      return buildFlattenView()
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

    return child
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column') return ''
    return res
  }
}
