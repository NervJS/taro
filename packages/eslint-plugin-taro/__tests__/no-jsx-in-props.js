const rule = require('../rules/no-jsx-in-props')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不允许在 JSX 参数(props)中传入 JSX 元素'

ruleTester.run('no-jsx-in-props', rule, {
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
    `<View child={<View />} />`,
    `<View child={() => <View />} />`,
    `<View child={function () { <View /> }} />`,
    `<View child={ary.push(<View />)} />`,
    `<View child={ary.map(a => <View />)} />`
  ])
})
