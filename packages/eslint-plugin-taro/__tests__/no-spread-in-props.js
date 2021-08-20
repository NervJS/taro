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

const rule = require('../rules/no-spread-in-props')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')
require('babel-eslint')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在 JSX 参数中使用对象展开符(Object spread)'

ruleTester.run('no-spread-in-props', rule, {
  invalid: testInvalid(ERROR_MESSAGE, [
    '<View {...this.props} />',
    '<View {...props} />',
    '<Input {...props} />'
  ]),
  valid: testValid([
    '<View test />'
    // @TODO eslint 的测试环境无法解析解构表达式, 暂不清楚原因
    // `const a = { ...b }`
  ])
})
