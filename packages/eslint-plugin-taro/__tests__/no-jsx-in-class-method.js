const rule = require('../rules/no-jsx-in-class-method')
const { RuleTester } = require('eslint')
const { parserOptions, testValid } = require('../utils/utils')
require('babel-eslint')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

function testInvalid (message, tests) {
  return tests.map(code => ({
    code,
    errors: [{ message }]
  }))
}

const ERROR_MESSAGE = '暂不支持在 render() 之外的方法定义 JSX'

ruleTester.run('no-jsx-in-class-method', rule, {
  valid: testValid([
    `numbers.map((number) => number * 2)`,
    `numbers.map((number) => {
      return number * 2
    })`,
    `numbers.map((number) => {
      const element = <View />
      return number * 2
    })`,
    `numbers.map((number) => {
      const element = <View />
      return <View />
    })`,
    `numbers.map((number) => {
      const element = <View />
      let a = null
      if (number) {
        a = 'test'
      }
      return <View />
    })`
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `
    class App extends Component {
      test(a) {
        return a.map(_ => <View />)
      }
    }
    `,
    `
    class App extends Component {
      renderHeader() {
        return <Header />
      }
    }
    `,
    `
    class App extends Component {
      renderHeader = () => {
        return <Header />
      }
    }
    `
  ])
})
