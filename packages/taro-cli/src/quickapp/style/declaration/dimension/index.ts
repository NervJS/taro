export default {
  'height': (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto') || ~value.indexOf('inherit')) {
      addDeclaration('display', 'flex') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    if (~value.indexOf('calc')) {
      return 'I:'
    }
    if (parseInt(value) === 0) {
      addDeclaration('display', 'none') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    return ''
  },
  'max-height': 'I:',
  'max-width': 'I:',
  'min-height': 'I:',
  'min-width': 'I:',
  'width': (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto') || ~value.indexOf('inherit')) {
      addDeclaration('display', 'flex') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    if (~value.indexOf('calc')) {
      return 'I:'
    }
    if (parseInt(value, 10) === 0) {
      addDeclaration('display', 'none') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    return ''
  },
  'display': (value, declaration, addDeclaration) => {
    if (~['flex', 'none'].indexOf(value)) {
      return ''
    }
    return 'I:'
  }
}
