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

  replacePropName (name: string, value: string, componentName: string) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    if (componentName === 'share-element') {
      if (value === 'i.mapkey') return 'key'
    }
    return name
  }

  buildXSTepFocus (nn: string) {
    if (this.pluginOptions.enablekeyboardAccessory) {
      return `function(i, prefix) {
      var s = i.focus !== undefined ? 'focus' : 'blur'
      var r = prefix + i.${nn} + '_' + s
      if ((i.nn === 'textarea' || i.nn === 'input') && i.cn[0] && i.cn[0].nn === 'keyboard-accessory') {
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

      const target = `
    <keyboard-accessory style="{{i.cn[0].st}}" class="{{i.cn[0].cl}}" bindtap="eh"  id="{{i.cn[0].uid||i.cn[0].sid}}" data-sid="{{i.cn[0].sid}}">
      <block wx:for="{{i.cn[0].cn}}" wx:key="sid">
        <template is="{{xs.e(cid+1)}}" data="{{i:item,l:l}}" />
      </block>
    </keyboard-accessory>
  `

      const templateFocus = list[1]
        .replace(children, target)
        .replace(`_${nodeName}_focus`, `_${nodeName}_focus_ka`)

      const templateBlur = list[2]
        .replace(children, target)
        .replace(`_${nodeName}_blur`, `_${nodeName}_blur_ka`)

      list.splice(3, 0, templateFocus, templateBlur)
      return list.join('</template>')
    }

    return res
  }
}
