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
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
    experimentalObjectRestSpread: true
  }
}

function isTaroComponent (context, node) {
  let classDcl
  if (node.type === 'ClassDeclaration') {
    classDcl = node
  } else {
    const parents = context.getAncestors(node)
    classDcl = parents.find(p => p.type === 'ClassDeclaration')
  }
  if (
    classDcl && classDcl.superClass
  ) {
    const superClass = classDcl.superClass
    if (superClass.type === 'Identifier' && superClass.name === 'Component') {
      return true
    }
    if (superClass.type === 'MemberExpression' && superClass.object.name === 'Taro' && superClass.property.name === 'Component') {
      return true
    }
  }
  return false
}

function testComponent (code) {
  return `
class App extends Component {
  render () {
      ${code}
  }
}
`
}

function testValid (tests) {
  return tests.map(code => ({
    code: testComponent(code),
    parser: 'babel-eslint'
  }))
}

function testInvalid (message, tests) {
  return tests.map(code => ({
    code: testComponent(code),
    errors: [{ message }],
    parser: 'babel-eslint'
  }))
}

module.exports = {
  docsUrl,
  buildDocsMeta,
  parserOptions,
  testComponent,
  testValid,
  testInvalid,
  isTaroComponent
}
