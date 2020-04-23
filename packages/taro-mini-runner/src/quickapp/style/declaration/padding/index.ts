export default {
  padding: (value, _, __) => {
    if (~value.indexOf('auto')) {
      return 'I:'
    }
  },
  'padding-bottom': '',
  'padding-left': '',
  'padding-right': '',
  'padding-top': ''
}
