export default {
  'box-sizing': 'I:',
  'box-flex': 'I:',
  'box-align': 'I:',
  'box-orient': (value, declaration, addDeclaration) => {
    const boxOrient = {
      horizontal: 'row',
      vertical: 'row-reverse',
      'inline-axis': 'row',
      'block-axis': 'row-reverse',
      inherit: ''
    }
    if (value === 'inherit') {
      return 'I:'
    }
    // flex-direction 不支持 row-reverse
    if (!~boxOrient[value].indexOf('row-reverse')) {
      addDeclaration('flex-direction', boxOrient[value])
    }
    return 'I:'
  },
  float: 'E:',
  content: 'I:',
  overflow: 'I:',
  'overflow-x': 'I:',
  'overflow-y': 'I:',
  'overflow-scrolling': 'I:'
}
