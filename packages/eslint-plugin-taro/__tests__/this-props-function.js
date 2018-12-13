const rule = require('../rules/this-props-function')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const ERROR_MESSAGE = '从 this.props 而来的函数名必须要以 `on` 或 `dispatch` 开头'

function testInvalid (message, tests) {
  return tests.map(code => ({
    code,
    errors: [{ message }]
  }))
}

ruleTester.run('no-stateless-component', rule, {
  valid: [{
    code: testComponent(`this.props.onClick()`)
  }, {
    code: testComponent(`this.props.onF()`)
  }, {
    code: testComponent(`this.dispatch()`)
  }, {
    code: testComponent(`this.dispatchF()`)
  }, {
    code: testComponent(`this.click()`)
  }, {
    code: testComponent(`click()`)
  }, {
    code: testComponent(`this.test.click()`)
  }, {
    code: testComponent(`this.a.onF()`)
  }],
  invalid: testInvalid(ERROR_MESSAGE, [
    `this.props.click()`,
    `this.props.f()`,
    `this.props.onf`,
    `this.props.dispatchf`
  ])
})
