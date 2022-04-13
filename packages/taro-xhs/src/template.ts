import { RecursiveTemplate } from '@tarojs/shared/dist/template'
export class Template extends RecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'xhs:if',
    else: 'xhs:else',
    elseif: 'xhs:elif',
    for: 'xhs:for',
    forItem: 'xhs:for-item',
    forIndex: 'xhs:for-index',
    key: 'xhs:key',
    type: 'xhs'
  }

  replacePropName (name: string, value: string) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }
}
