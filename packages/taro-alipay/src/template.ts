/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
    delete result['native-slot']

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

  modifyThirdPartyLoopBody = () => {
    // 兼容支付宝 2.0 构建
    const slot = this.componentsAlias.slot
    const slotAlias = slot._num
    const slotNamePropAlias = slot.name

    return `<view a:if="{{item.nn==='${slotAlias}'}}" slot="{{item.${slotNamePropAlias}}}" id="{{item.uid||item.sid}}" data-sid="{{item.sid}}">
        <block a:for="{{item.cn}}" a:key="sid">
          <template is="{{xs.e(0)}}" data="{{i:item}}" />
        </block>
      </view>
      <template a:else is="{{xs.e(0)}}" data="{{i:item}}" />`
  }

  buildXSTmpExtra () {
    const swiperItemAlias = this.componentsAlias['swiper-item']._num
    return `f: function (l) {
    return l.filter(function (i) {return i.nn === '${swiperItemAlias}'})
  }`
  }
}
