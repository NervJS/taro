export default {
  'font-size': (value, declaration, _) => {
    if (~value.indexOf('inherit')) {
      return 'I:'
    }
    // 直接替换成px
    if (~value.indexOf('pt')) {
      declaration.value = declaration.value.replace('pt', 'px')
    }
  },
  'font-weight': (value, declaration, _) => {
    if (value === 400) {
      declaration.value = 'normal'
    } else if (value > 400) {
      declaration.value = 'bold'
    } else if (!['lighter', 'bold', 'bolder'].includes(value)) {
      return 'I:'
    }
  },
  'font-style': '',
  'font-family': 'I:',
  'font-variant': 'I:'
}
