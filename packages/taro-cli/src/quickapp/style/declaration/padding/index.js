export default {
  'padding': (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto')) {
      return 'I:'
    }
  },
  'padding-bottom': '',
  'padding-left': '',
  'padding-right': '',
  'padding-top': ''
}
