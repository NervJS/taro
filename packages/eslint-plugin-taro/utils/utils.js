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

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
}

function testComponent (code) {
  return `
class App extends Component {
  render () {
    return (
      ${code}
    )
  }
}
`
}

module.exports = {
  docsUrl,
  buildDocsMeta,
  parserOptions,
  testComponent
}
