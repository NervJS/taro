import { capitalize, Shortcuts, toCamelCase } from '@tarojs/shared'
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

  transferComponents: Record<string, Record<string, string>> = {}

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
    delete result['native-slot']

    // PageMeta & NavigationBar
    this.transferComponents['page-meta'] = result['page-meta']
    delete result['page-meta']

    return result
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'picker-view') {
      return `<picker-view-column class="{{item.cl}}" style="{{item.st}}">
        <view a:for="{{item.cn}}" a:key="sid">
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
    <block a:for="{{xs.f(i.cn)}}" a:key="sid">
      <swiper-item class="{{item.cl}}" style="{{item.st}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}">
        <block a:for="{{item.cn}}" a:key="sid">
          <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{i:item}}" />
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

    return `<view a:if="{{item.nn==='${slotAlias}'}}" slot="{{item.${slotNamePropAlias}}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}">
        <block a:for="{{item.cn}}" a:key="sid">
          <template is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{i:item}}" />
        </block>
      </view>
      <template a:else is="{{xs.a(0, item.${Shortcuts.NodeName})}}" data="{{i:item}}" />`
  }

  buildXSTmpExtra () {
    const swiperItemAlias = this.componentsAlias['swiper-item']._num
    return `f: function (l) {
    return l.filter(function (i) {return i.nn === '${swiperItemAlias}'})
  }`
  }

  buildPageTemplate = (baseTempPath: string, page) => {
    let pageMetaTemplate = ''
    const pageConfig = page?.content

    if (pageConfig?.enablePageMeta) {
      const getComponentAttrs = (componentName: string, dataPath: string) => {
        return Object.entries(this.transferComponents[componentName]).reduce((sum, [key, value]) => {
          sum +=`${key}="${value === 'eh' ? value : `{{${value.replace('i.', dataPath)}}}`}" `
          return sum
        }, '')
      }
      const pageMetaAttrs = getComponentAttrs('page-meta', 'pageMeta.')

      pageMetaTemplate = `
<import-sjs name="xs" from="${baseTempPath.replace('base.axml', 'utils.sjs')}" />
<page-meta data-sid="{{pageMeta.sid}}" ${pageMetaAttrs}></page-meta>`
    }

    const template = `<import src="${baseTempPath}"/>${pageMetaTemplate}
<template is="taro_tmpl" data="{{${this.dataKeymap('root:root')}}}" />`

    return template
  }
}
