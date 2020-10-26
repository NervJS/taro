export default {
  color: (value) => {
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
  'text-decoration': (value) => {
    if (~['overline', 'blink'].indexOf(value)) {
      return 'I:'
    }
  },
  'text-overflow': (value) => {
    // 在设置了行数的情况下生效
    if (!value) {
      return 'I:'
    }
  },
  'white-space': 'I:',
  'word-wrap': 'I:',
  'word-break': 'I:',
  'text-align-last': 'I:',
  'line-clamp': (value, declaration, addDeclaration) => {
    if (value > 0) {
      addDeclaration('lines', value)
    }
    return 'I:'
  },
  lines: ''
}
