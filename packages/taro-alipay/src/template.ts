import { RecursiveTemplate, capitalize, toCamelCase } from '@tarojs/shared'

export class Template extends RecursiveTemplate {
  exportExpr = 'export default'
  supportXS = true
  Adapter = {
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',
    xs: 'sjs',
    type: 'alipay'
  }

  buildXsTemplate () {
    return '<import-sjs name="xs" from="./utils.sjs" />'
  }

  replacePropName (name, value, compName) {
    if (value === 'eh') return name.replace('bind', 'on')
    if (compName === 'map' && value.includes('polygons')) {
      name = 'polygon'
    }
    return name
  }

  getEvents () {
    return {
      onTap: 'eh',
      onTouchMove: 'eh',
      onTouchEnd: 'eh',
      onTouchCancel: 'eh',
      onLongTap: 'eh'
    }
  }

  buildThirdPartyAttr (attrs: Set<string>) {
    return [...attrs].reduce((str, attr) => {
      if (attr.startsWith('@')) {
        return str + `on${capitalize(attr.slice(1))}="eh" `
      } else if (attr.startsWith('bind')) {
        return str + `${attr}="eh" `
      } else if (attr.startsWith('on')) {
        return str + `${attr}="eh" `
      }

      return str + `${attr}="{{ i.${toCamelCase(attr)} }}" `
    }, '')
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'picker-view') {
      return `<picker-view-column>
        <view a:for="{{item.cn}}" a:key="uid">
          ${child}
        </view>
      </picker-view-column>`
    }
    return child
  }

  modifyLoopContainer = (children: string, nodeName: string) => {
    if (nodeName === 'picker') {
      return `
  <view>${children}</view>
  `
    }
    if (nodeName === 'swiper') {
      return `
    <block a:for="{{xs.f(i.cn)}}" a:key="uid">
      <swiper-item class="{{item.cl}}" style="{{item.st}}" id="{{item.uid}}">
        <block a:for="{{item.cn}}" a:key="uid">
          <template is="{{xs.e(0)}}" data="{{i:item}}" />
        </block>
      </swiper-item>
    </block>
  `
    }
    return children
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column' || nodeName === 'swiper-item') return ''
    return res
  }

  buildXSTmpExtra () {
    return `f: function (l) {
    return l.filter(function (i) {return i.nn === 'swiper-item'})
  }`
  }
}
