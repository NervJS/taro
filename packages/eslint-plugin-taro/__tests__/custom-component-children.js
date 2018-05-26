const rule = require('../rules/custom/custom-component-children')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在自定义组件中写 children'

ruleTester.run('custom-component-children', rule, {
  valid: [{
    code: testComponent(`<View />`)
  }, {
    code: testComponent(`<View>test</View>`)
  }, {
    code: testComponent(`<View>{'test'}</View>`)
  }, {
    code: testComponent(`<View>
      <CustomComponent />
    </View>`)
  }, {
    code: testComponent(`<CustomComponent />`)
  }, {
    code: testComponent(`<CustomComponent> </CustomComponent>`)
  }],
  invalid: [{
    code: testComponent(`<CustomComponent>test</CustomComponent>`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent>{'test'}</CustomComponent>`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent>
      <Other />
    </CustomComponent>`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<Typo>{}</Typo>`),
    errors: [{ message: ERROR_MESSAGE }]
  }]
})
