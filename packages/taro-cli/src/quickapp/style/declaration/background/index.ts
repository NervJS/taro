export default {
  'background': (value, declaration, addDeclaration) => {
    if (~value.indexOf('linear-gradient')) { // 线性
      // 按照指定方向渐变时，必须有to在direction前。
      var DIR_REG = /linear\-gradient\((top|right|bottom|left)/
      var ret = value.match(DIR_REG)
      if (ret) {
        declaration.value = value.replace(DIR_REG, 'linear-gradient(to ' + ret[1])
      }
      return ''
    }
    const values = value.split(' ')
    if (~values[0].indexOf('url')) {
      addDeclaration('background-image', value)
    } else {
      // 颜色值为transparent时忽略
      if (!~value.indexOf('transparent') || !~value.indexOf('-webkit')) {
        addDeclaration('background-color', value)
      }
    }
    return 'I:'
  },
  'background-color': (value, declaration, addDeclaration) => {
    if (~value.indexOf('transparent') || !~value.indexOf('-webkit')) {
      return 'I:'
    }
  },
  'background-image': '',
  'background-size': (value, declaration, addDeclaration) => {
    //最多支持2个参数,比如50% 50%
    const len = value.split(' ')
    if (len <= 2) {
      return ''
    }
    return 'I:'
  },
  'background-repeat': (value, declaration, addDeclaration) => { 
    const validValue = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat']
    if (~validValue.indexOf(value)) {
      return ''
    }
    return 'I:'
  },
  'background-attachment': 'I:',
  'background-position': (value, declaration, addDeclaration) => {
    //不支持逗号分隔
    if (~value.indexOf(',')) {
      return 'I:'
    }
    return ''
  },
  'background-origin': 'I:',
  'background-clip': 'I:'
}
