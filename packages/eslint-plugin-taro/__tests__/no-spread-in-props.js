const rule = require('../rules/no-spread-in-props')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')
require('babel-eslint')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在 JSX 参数中使用对象展开符(Object spread)'

ruleTester.run('no-spread-in-props', rule, {
  invalid: testInvalid(ERROR_MESSAGE, [
    `<View {...this.props} />`,
    `<View {...props} />`,
    `<Input {...props} />`
  ]),
  valid: testValid([
    `<View test />`
    // @TODO eslint 的测试环境无法解析解构表达式, 暂不清楚原因
    // `const a = { ...b }`
  ])
})
