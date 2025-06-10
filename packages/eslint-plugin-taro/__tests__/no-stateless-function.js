const rule = require('../rules/no-stateless-component')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '暂不支持无状态组件（stateless component）'

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
  }, {
    code: testComponent(`const searchbar = (
      <View>
        <View className="head">
          <Input onConfirm="search_key" className="keyword" placeholder="目的地/关键字" placeholderClass="search-place" type="text" />
        </View>
        <View className="seek">
          <Text className="seek_history">搜索历史：</Text>
          {histories}
        </View>
      </View>
    );`)
  }],
  invalid: testInvalid(ERROR_MESSAGE, [
    `function Test () { return <View /> }`,
    `function Test (cls) { return <View class={cls} /> }`,
    `function Test () { return this.state.ary.map(() => <View />) }`,
    `const Test = () => {  return <View /> }`,
    `const Test = function () { return <View /> }`
  ])
})
