import { UnRecursiveTemplate } from '@tarojs/shared/dist/template'

export class Template extends UnRecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'jd:if',
    else: 'jd:else',
    elseif: 'jd:elif',
    for: 'jd:for',
    forItem: 'jd:for-item',
    forIndex: 'jd:for-index',
    key: 'jd:key',
    type: 'jd'
  }

  replacePropName (name, value) {
    if (name === 'bingdlongtap') return 'bindlongpress'
    if (value === 'eh') return name.toLowerCase()
    return name
  }
}
