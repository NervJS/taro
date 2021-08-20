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

const rule = require('../rules/no-jsx-in-class-method')
const { RuleTester } = require('eslint')
const { parserOptions, testValid } = require('../utils/utils')
require('babel-eslint')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

function testInvalid (message, tests) {
  return tests.map(code => ({
    code,
    errors: [{ message }]
  }))
}

const ERROR_MESSAGE = '暂不支持在 render() 之外的方法定义 JSX'

ruleTester.run('no-jsx-in-class-method', rule, {
  valid: testValid([
    'numbers.map((number) => number * 2)',
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
    })`
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `
    class App extends Component {
      test(a) {
        return a.map(_ => <View />)
      }
    }
    `,
    `
    class App extends Component {
      renderHeader() {
        return <Header />
      }
    }
    `,
    `
    class App extends Component {
      renderHeader = () => {
        return <Header />
      }
    }
    `
  ])
})
