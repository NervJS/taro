import { UnRecursiveTemplate } from '@tarojs/shared/dist/template'

export class Template extends UnRecursiveTemplate {
  supportXS = true
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

  buildXsTemplate () {
    return '<jds src="./utils.jds" module="xs" />'
  }

  replacePropName (name, value, componentName) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }
}
