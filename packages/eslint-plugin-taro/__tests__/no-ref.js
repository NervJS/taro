const rule = require('../rules/no-ref')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '定义 ref 在微信小程序不会起作用'

ruleTester.run('no-ref', rule, {
  valid: testValid([
    `<View onClick={this.hanldeClick} />`,
    `<View onClick={this.props.hanldeClick.bind(this)} />`,
    `<View onClick={this.hanldeClick(id)} />`,
    `<View onClick={this.hanldeClick(id)()} />`,
    `<View onClick={''} />`,
    `<View onClick={true} />`,
    `<View onClick={undefined} />`,
    `<View onClick={[]} />`,
    `<View onClick={{}} />`
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `<View ref />`,
    `<View ref={this.refs.a} />`,
    `<View ref={(node) => this.a = node} />`
  ])
})
