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

const rule = require('../rules/class-naming')
const { RuleTester } = require('eslint')
const { parserOptions } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const ERROR_MESSAGE = '组件名不得与小程序内置组件名重复'

function testClassMethod (name, expr, from) {
  const source = from || '@tarojs/components'
  return `
  import { View } from '${source}'
  class ${name} extends Component {
    render () { ${expr} }
  }`
}

ruleTester.run('class-naming', rule, {
  valid: [
    {
      code: testClassMethod('Test')
    },
    {
      code: testClassMethod('Test', '<Text />')
    },
    {
      code: testClassMethod('B')
    }
  ],
  invalid: [
    {
      code: testClassMethod('Text'),
      errors: [{ message: ERROR_MESSAGE }]
    }
  ]
})
