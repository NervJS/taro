import { capitalize, toCamelCase } from '@tarojs/shared'
import { RecursiveTemplate } from '@tarojs/shared/dist/template'

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

  replacePropName (name, value, compName, componentAlias) {
    if (value === 'eh') return name.replace('bind', 'on')

    if (compName === 'map') {
      const polygonsAlias = componentAlias.polygons
      if (value.includes(polygonsAlias)) {
        name = 'polygon'
      }
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

  createMiniComponents (components): any {
    const result = super.createMiniComponents(components)

    // 兼容支付宝 2.0 构建
    delete result.slot
    delete result['slot-view']

    return result
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'picker-view') {
      return `<picker-view-column class="{{i[item].cl}}" style="{{i[item].st}}">
  <view a:for="{{i[item].cn}}" a:key="*this" a:for-item="node">
    <template is="{{xs.e(0)}}" data="{{i:i[item][node]}}" />
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
    <block a:for="{{xs.f(i)}}" a:key="*this">
      <swiper-item class="{{i[item].cl}}" style="{{i[item].st}}" id="{{i[item].uid||i[item].sid}}" data-sid="{{i[item].sid}}">
        <block a:for="{{i[item].cn}}" a:key="*this" a:for-item="node">
          <template is="{{xs.e(0)}}" data="{{i:i[item][node]}}" />
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

  modifyThirdPartyLoopBody = () => {
    // 兼容支付宝 2.0 构建
    const slot = this.componentsAlias.slot
    const slotAlias = slot._num
    const slotNamePropAlias = slot.name

    return `<view a:if="{{i[item].nn==='${slotAlias}'}}" slot="{{i[item].${slotNamePropAlias}}}" id="{{i[item].uid||i[item].sid}}" data-sid="{{i[item].sid}}">
        <block a:for="{{i[item].cn}}" a:key="*this" a:for-item="node">
          <template is="{{xs.e(0)}}" data="{{i:i[item][node]}}" />
        </block>
      </view>
      <template a:else is="{{xs.e(0)}}" data="{{i:i[item]}}" />`
  }

  buildXSTmpExtra () {
    const swiperItemAlias = this.componentsAlias['swiper-item']._num
    return `f: function (l) {
    return l.cn.filter(function (i) {return l[i].nn === '${swiperItemAlias}'})
  }`
  }
}
