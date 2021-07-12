import { UnRecursiveTemplate } from '@tarojs/shared/dist/template'

export class Template extends UnRecursiveTemplate {
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

  modifyLoopContainer = (children, nodeName) => {
    if (nodeName !== 'textarea') return children
    return `
    <keyboard-accessory style="{{i.cn[0].st}}" class="{{i.cn[0].cl}}" bindtap="eh"  id="{{i.cn[0].uid}}">
      <block wx:for="{{i.cn[0].cn}}" wx:key="uid">
        <template is="{{xs.e(cid+1)}}" data="{{i:item,l:l}}" />
      </block>
    </keyboard-accessory>
    `
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'keyboard-accessory') return ''
    return res
  }
}
