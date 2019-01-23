const rule = require('../rules/no-anonymous-function-in-props')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在 JSX 参数中使用匿名函数'

ruleTester.run('no-anonymous-function-in-props', rule, {
  valid: testValid([
    `<View onClick={this.hanldeClick} />`,
    `<View onClick={this.props.hanldeClick} />`,
    `<View onClick={this.hanldeClick.bind(this)} />`,
    `<View onClick={this.props.hanldeClick.bind(this)} />`,
    `<View onClick={this.hanldeClick(id)} />`,
    `<View onClick={this.hanldeClick(id)()} />`,
    `<View ref={(e) => this.handleClick(e)} />`
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `<View onClick={() => this.handleClick()} />`,
    `<View onClick={(e) => this.handleClick(e)} />`,
    `<View onClick={() => ({})} />`,
    `<View onClick={function () {}} />`,
    `<View onClick={function (e) {this.handleClick(e)}} />`
  ])
})
