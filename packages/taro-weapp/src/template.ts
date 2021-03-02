import { UnRecursiveTemplate } from '@tarojs/shared'

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
}
