/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

const rule = require('../rules/this-props-function')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const ERROR_MESSAGE = '从 this.props 而来的函数名必须要以 `on` 或 `dispatch` 或 `render` 开头。详情：https://nervjs.github.io/taro/docs/event.html#%E4%BB%BB%E4%BD%95%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%BC%A0%E9%80%92%E9%83%BD%E8%A6%81%E4%BB%A5-on-%E5%BC%80%E5%A4%B4'

function testInvalid (message, tests) {
  return tests.map(code => ({
    code,
    errors: [{ message }]
  }))
}

ruleTester.run('this-props-function', rule, {
  valid: [{
    code: testComponent('this.props.onClick()')
  }, {
    code: testComponent('this.props.onF()')
  }, {
    code: testComponent('this.dispatch()')
  }, {
    code: testComponent('this.dispatchF()')
  }, {
    code: testComponent('this.click()')
  }, {
    code: testComponent('click()')
  }, {
    code: testComponent('this.test.click()')
  }, {
    code: testComponent('this.a.onF()')
  }],
  invalid: testInvalid(ERROR_MESSAGE, [
    'this.props.click()',
    'this.props.f()',
    'this.props.onf()',
    'this.props.dispatchf()'
  ])
})
