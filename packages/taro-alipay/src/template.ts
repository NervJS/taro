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
        <view a:for="{{item.cn}}" a:key="id">
          ${child}
        </view>
      </picker-view-column>`
    }
    if (nodeName === 'swiper') {
      return `<swiper-item>
        <view a:for="{{item.cn}}" a:key="id">
          ${child}
        </view>
      </swiper-item>`
    }
    return child
  }

  modifyLoopContainer = (children: string, nodeName: string) => {
    if (nodeName === 'picker') {
      return `
  <view>${children}</view>
  `
    }
    return children
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column' || nodeName === 'swiper-item') return ''
    return res
  }
}
