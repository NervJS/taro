export default {
  margin: (value, _, __) => {
    if (~value.indexOf('auto')) {
      return 'I:'
    }
  },
  'margin-bottom': '',
  'margin-left': '',
  'margin-right': '',
  'margin-top': ''
}
