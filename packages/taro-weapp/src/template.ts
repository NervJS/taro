/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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

  constructor (pluginOptions: IOptions) {
    super()
    this.pluginOptions = pluginOptions || {}
  }

  buildXsTemplate () {
    return '<wxs module="xs" src="./utils.wxs" />'
  }

  replacePropName (name: string, value: string, componentName: string) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }

  buildXSTepFocus (nn: string) {
    if (this.pluginOptions.enablekeyboardAccessory) {
      return `function(i, prefix) {
      var s = i.focus !== undefined ? 'focus' : 'blur'
      var r = prefix + i.${nn} + '_' + s
      if (i.nn === 'textarea' && i.cn[0] && i.cn[0].nn === 'keyboard-accessory') {
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

    if (nodeName === 'textarea' && this.pluginOptions.enablekeyboardAccessory) {
      const list = res.split('</template>')

      const target = `
    <keyboard-accessory style="{{i.cn[0].st}}" class="{{i.cn[0].cl}}" bindtap="eh"  id="{{i.cn[0].uid}}">
      <block wx:for="{{i.cn[0].cn}}" wx:key="uid">
        <template is="{{xs.e(cid+1)}}" data="{{i:item,l:l}}" />
      </block>
    </keyboard-accessory>
  `

      const templateFocus = list[1]
        .replace(children, target)
        .replace('_textarea_focus', '_textarea_focus_ka')

      const templateBlur = list[2]
        .replace(children, target)
        .replace('_textarea_blur', '_textarea_blur_ka')

      list.splice(3, 0, templateFocus, templateBlur)
      return list.join('</template>')
    }

    return res
  }
}
