const rule = require('../rules/class-naming')
const { RuleTester } = require('eslint')
const { parserOptions } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const ERROR_MESSAGE = '组件名不得与小程序内置组件名重复'

function testClassMethod (name, expr, from) {
  const source = from || '@tarojs/components'
  return `
  import { View } from '${source}'
  class ${name} extends Component {
    render () { ${expr} }
  }`
}

ruleTester.run('class-naming', rule, {
  valid: [
    {
      code: testClassMethod(`Test`)
    },
    {
      code: testClassMethod(`Test`, '<Text />')
    },
    {
      code: testClassMethod(`B`)
    }
  ],
  invalid: [
    {
      code: testClassMethod(`Text`),
      errors: [{ message: ERROR_MESSAGE }]
    }
  ]
})
