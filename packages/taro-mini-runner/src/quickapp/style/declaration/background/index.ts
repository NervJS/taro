export default {
  background: (value, declaration, addDeclaration) => {
    if (~value.indexOf('linear-gradient')) { // 线性
      // 按照指定方向渐变时，必须有to在direction前。
      const DIR_REG = /linear-gradient\((top|right|bottom|left)/
      const ret = value.match(DIR_REG)
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
      if (!~value.indexOf('transparent')) {
        addDeclaration('background-color', value)
      }
    }
    return 'I:'
  },
  'background-color': (value, _, __) => {
    if (~value.indexOf('transparent')) {
      return 'I:'
    }
  },
  'background-image': '',
  'background-size': '',
  'background-repeat': '',
  'background-attachment': 'I:',
  'background-position': '',
  'background-origin': 'I:',
  'background-clip': 'I:'
}
