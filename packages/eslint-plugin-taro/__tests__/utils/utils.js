const parserOptions = {
  babelOptions: {
    presets: ['@babel/preset-react'],
    plugins: ['@babel/plugin-syntax-jsx']
  },
  ecmaFeatures: {
    jsx: true,
    experimentalObjectRestSpread: true
  },
  ecmaVersion: 2018,
  requireConfigFile: false,
  sourceType: 'module',
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

function testValid (tests, withCompWrapper = true) {
  return tests.map(code => ({
    code: withCompWrapper ? testComponent(code) : code,
    parser: require.resolve('@babel/eslint-parser'),
  }))
}

function testInvalid (message, tests, withCompWrapper = true) {
  return tests.map(code => ({
    code: withCompWrapper ? testComponent(code) : code,
    errors: [{ message }],
    parser: require.resolve('@babel/eslint-parser'),
  }))
}

function testInvalids (tests, withCompWrapper = true) {
  return tests.map(([code, message = '']) => ({
    code: withCompWrapper ? testComponent(code) : code,
    errors: [{ message }],
    parser: require.resolve('@babel/eslint-parser'),
  }))
}

module.exports = {
  parserOptions,
  testComponent,
  testValid,
  testInvalid,
  testInvalids,
}
