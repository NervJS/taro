const rule = require('../rules/reserve-class-properties')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const ERROR_MESSAGE = ''

function testInvalid (message, tests) {
  return tests.map(code => ({
    code,
    errors: [{ message }]
  }))
}

ruleTester.run('no-stateless-component', rule, {
  valid: [{
    code: testComponent(`<View />`)
  }, {
    code: testComponent(`<View>test</View>`)
  }, {
    code: testComponent(`<ScrollView>test</ScrollView>`)
  }, {
    code: testComponent(`<View>{'test'}</View>`)
  }, {
    code: testComponent(`<View>
      <CustomComponent />
    </View>`)
  }, {
    code: `
    const array = ['test1', 'test2', 'test3'];
    const element = array.map(item => <View>{item}</View>)
    `
  }, {
    code: `
    const array = ['test1', 'test2', 'test3'];
    const element = array.map(item => {
      return <View>{item}</View>
    })
    `
  }, {
    code: `
    const array = ['test1', 'test2', 'test3'];
    const element = array.map(item => {
      return <View>{item}</View>
    })
    `
  }, {
    code: `
    const array = ['test1', 'test2', 'test3'];
    const element = this.state.array.map(item => {
      return <View>{item}</View>
    })
    `
  }],
  invalid: testInvalid(ERROR_MESSAGE, [
    `class A extends Component { _initData () {} }`,
    `class A extends Component { $data = []; initData () {} }`
  ])
})
