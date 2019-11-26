export default {
  'margin': (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto')) {
      return 'I:'
    }
  },
  'margin-bottom': '',
  'margin-left': '',
  'margin-right': '',
  'margin-top': ''
}
