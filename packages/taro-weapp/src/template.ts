/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { UnRecursiveTemplate } from '@tarojs/shared/dist/template'

import type { IOptions } from './index'

export class Template extends UnRecursiveTemplate {
  pluginOptions: IOptions
  supportXS = true
  Adapter = {
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',
    xs: 'wxs',
    type: 'weapp'
  }

  constructor (pluginOptions?: IOptions) {
    super()
    this.pluginOptions = pluginOptions || {}
  }

  buildXsTemplate () {
    return '<wxs module="xs" src="./utils.wxs" />'
  }

  replacePropName (name: string, value: string, componentName: string, componentAlias) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    if (componentName === 'share-element') {
      const mapKeyAlias = componentAlias.mapkey
      if (value === `i.${mapKeyAlias}`) return 'key'
    }
    return name
  }

  buildXSTepFocus (nn: string) {
    if (this.pluginOptions.enablekeyboardAccessory) {
      const textarea = this.componentsAlias.textarea._num
      const input = this.componentsAlias.input._num
      const ka = this.componentsAlias['keyboard-accessory']._num
      return `function(i, prefix) {
      var s = i.focus !== undefined ? 'focus' : 'blur'
      var r = prefix + i.${nn} + '_' + s
      if ((i.nn === '${textarea}' || i.nn === '${input}') && i.cn[0] && i.cn[0].nn === '${ka}') {
        r = r + '_ka'
      }
      return r
    }`
    } else {
      return super.buildXSTepFocus(nn)
    }
  }

  modifyTemplateResult = (res: string, nodeName: string, _level, children) => {
    if (nodeName === 'keyboard-accessory') return ''

    if ((nodeName === 'textarea' || nodeName === 'input') && this.pluginOptions.enablekeyboardAccessory) {
      const list = res.split('</template>')
      const componentAlias = this.componentsAlias[nodeName]
      const nodeNameAlias = componentAlias._num

      const target = `
    <keyboard-accessory style="{{i.cn[0].st}}" class="{{i.cn[0].cl}}" bindtap="eh"  id="{{i.cn[0].uid||i.cn[0].sid}}" data-sid="{{i.cn[0].sid}}">
      <block wx:for="{{i.cn[0].cn}}" wx:key="sid">
        <template is="{{xs.e(cid+1)}}" data="{{i:item,l:l}}" />
      </block>
    </keyboard-accessory>
  `

      const templateFocus = list[1]
        .replace(children, target)
        .replace(`_${nodeNameAlias}_focus`, `_${nodeNameAlias}_focus_ka`)

      const templateBlur = list[2]
        .replace(children, target)
        .replace(`_${nodeNameAlias}_blur`, `_${nodeNameAlias}_blur_ka`)

      list.splice(3, 0, templateFocus, templateBlur)
      return list.join('</template>')
    }

    return res
  }
}
