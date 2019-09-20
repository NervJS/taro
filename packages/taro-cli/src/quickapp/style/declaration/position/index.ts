import { getDeclarationValue } from '../../util'

function setValue (value, declaration) {
  const valueList = ['inherit', 'auto']
  if (~valueList.indexOf(value)) {
    return 'I:'
  }
  return ''
}

export default {
  'bottom': (value, declaration, addDeclaration) => {
    return setValue(value, declaration)
  },
  // 'display': '',
  'display': (value, declaration, addDeclaration, rule) => {
    // 暂时忽略掉不支持的情况
    if (!~['flex', 'none'].indexOf(value)) {
      return 'E:'
    }
    if (value === 'flex') { // 因全局设置了flex-direction:column,故,当display:flex且未指定direction,还原为默认值row
      if (!getDeclarationValue('flex-direction', rule)) {
        addDeclaration('flex-direction', 'row')
      }
    }
  },
  'left': (value, declaration, addDeclaration) => {
    return setValue(value, declaration)
  },
  'position': (value, declaration, addDeclaration) => {
    if (value === 'static') {
      declaration.value = 'none'
    } else if (value === 'absolute') {
      return 'E:'
    } else if (value !== 'fixed') {
      return 'I:'
    }
  },
  'right': (value, declaration, addDeclaration) => {
    return setValue(value, declaration)
  },
  'top': (value, declaration, addDeclaration) => {
    return setValue(value, declaration)
  },
  'overflow': 'I:',
  'vertical-align': 'I:',
  'z-index': 'I:'
}
