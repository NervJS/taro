const rule = require('../rules/manipulate-jsx-as-array')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能使用 Array#map 之外的方法操作 JSX 数组'

ruleTester.run('manipulate-jsx-as-array', rule, {
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
    })`,
    `numbers.filter(Boolean).map((number) => {
      const element = <View />
      return <View />
    })`
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `test.push(<View />)`,
    `numbers.forEach(numbers => {
      a = <View />
    })`,
    `test.shift(<View />)`,
    `components.find(component => {
      return component === <View />
    })`,
    `components.fill(<View />)`,
    `components.some(component => component.constructor === <View />)`
  ])
})
