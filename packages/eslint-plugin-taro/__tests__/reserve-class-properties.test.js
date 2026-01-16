const rule = require('../rules/reserve-class-properties')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent, testInvalids } = require('./utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: require.resolve('@babel/eslint-parser') })

ruleTester.run('reserve-class-properties', rule, {
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
  invalid: testInvalids([
    [`class A extends Component { _initData () {} }`, '_initData 是 Taro 的内部保留方法，请改变变量名'],
    [`class A extends Component { $data = []; initData () {} }`, '$data 是 Taro 的内部保留属性，请改变变量名'],
  ], false)
})
