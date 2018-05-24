function docsUrl (rule) {
  return 'https://github.com/NervJS/taro/tree/master/packages/eslint-plugin-taro/docs/' + rule + '.md'
}

function buildDocsMeta (description, rule) {
  return {
    description: '[Taro] ' + description,
    category: 'Taro',
    recommended: true,
    url: docsUrl(rule)
  }
}

module.exports = {
  docsUrl,
  buildDocsMeta
}
