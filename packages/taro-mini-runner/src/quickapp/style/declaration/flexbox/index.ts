export default {
  flex: (value, declaration, addDeclaration) => {
    const props = ['grow', 'shrink', 'basis']
    if (value.match(/\s+/g)) {
      const values = value.split(' ')
      values.forEach((item, index) => {
        // flex-basis的值不支持设置为auto，且只支持具体的数值，差异过大暂时忽略。
        if (props[index] !== 'basis') {
          addDeclaration('flex-' + props[index], item)
        }
      })
      return 'I:'
    } else if (value === 'auto') {
      return 'I:'
    } else {
      return ''
    }
  },
  'flex-grow': '',
  'flex-shrink': '',
  'flex-basis': 'I:',
  'flex-direction': (value, _, __) => {
    if (~value.indexOf('row-reverse')) {
      return 'I:'
    }
  },
  'flex-wrap': '',
  'justify-content': (value, declaration, __) => {
    const content = ['flex-start', 'flex-end', 'center', 'space-between']
    if (value === 'space-around') {
      declaration.value = 'space-between'
      return ''
    }
    if (~content.indexOf(value)) { // justify-content:space-around
      return ''
    }
    return 'I:'
  },
  'align-items': '',
  'align-content': ''
}
