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

function testValid (tests) {
  return tests.map(code => ({ code: testComponent(code) }))
}

function testInvalid (message, tests) {
  return tests.map(code => ({
    code: testComponent(code),
    errors: [{ message }]
  }))
}

module.exports = {
  docsUrl,
  buildDocsMeta,
  parserOptions,
  testComponent,
  testValid,
  testInvalid
}
