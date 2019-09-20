export default {
  'color': (value, declaration, addDeclaration) => {
    if (~value.indexOf('inherit')) {
      return 'I:'
    }
  },
  'line-height': '',
  'text-align': (value, declaration, addDeclaration) => {
    addDeclaration('align-items', 'center')
    addDeclaration('justify-content', 'center')
    if (~value.indexOf('justify')) {
      return 'I:'
    }
  },
  'text-decoration': (value, declaration, addDeclaration) => {
    if (~['overline', 'blink'].indexOf(value)) {
      return 'I:'
    }
  },
  'text-overflow': (value, declaration, addDeclaration) => {
    // 在设置了行数的情况下生效
    if (value) {
      addDeclaration('lines', '1')
    }
  },
  'white-space': 'I:',
  'word-wrap': 'I:',
  'word-break': 'I:',
  'text-align-last': 'I:',
  'line-clamp': 'I:'
}
