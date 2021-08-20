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

const rule = require('../rules/function-naming')
const { RuleTester } = require('eslint')
const { parserOptions } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

const NUMBER_ERROR = '方法名包含数字可能会在小程序中无法使用'
const UNDERSCOPE_ERROR = '方法名以下划线 `_` 开头或结尾可能在小程序无法使用'
const LENGTH_ERROR = '方法名的长度大于 22 可能在小程序中无法使用'

function testClassMethod (name) {
  return `class A extends Component {
    ${name} () {}
  }`
}

function testClassPropFunction (name) {
  return `class A extends Component {
    ${name} = () => {}
  }`
}

ruleTester.run('jsx-handler-names', rule, {
  valid: [
    {
      code: testClassMethod('handleClick')
    },
    {
      code: testClassMethod('onTouchStart')
    },
    {
      code: testClassMethod('onTouchMove')
    },
    {
      code: testClassMethod('onTouchCancel')
    },
    {
      code: testClassMethod('onTouchEnd')
    },
    {
      code: testClassMethod('onAnimationStart')
    },
    {
      code: testClassMethod('onLongClick')
    },
    {
      code: testClassMethod('onTransitionEnd')
    },
    {
      code: testClassMethod('onAnimationStart')
    },
    {
      code: testClassPropFunction('handleClick')
    },
    {
      code: testClassPropFunction('onTouchStart')
    },
    {
      code: testClassPropFunction('onTouchMove')
    },
    {
      code: testClassPropFunction('onTouchCancel')
    },
    {
      code: testClassPropFunction('onTouchEnd')
    },
    {
      code: testClassPropFunction('onAnimationStart')
    },
    {
      code: testClassPropFunction('onLongClick')
    },
    {
      code: testClassPropFunction('onTransitionEnd')
    },
    {
      code: testClassPropFunction('onAnimation_Start')
    }
  ],
  invalid: [
    {
      code: testClassMethod('handleClick1'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassMethod('handle1Click'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassMethod('handle123Click'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassMethod('handle1Click666'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassMethod('_handleClick'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassMethod('handleClick_'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassMethod('__handleClick_'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassMethod('handleTestComponentClick'),
      errors: [{ message: LENGTH_ERROR }]
    },
    {
      code: testClassPropFunction('handleClick1'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassPropFunction('handle1Click'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassPropFunction('handle123Click'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassPropFunction('handle1Click666'),
      errors: [{ message: NUMBER_ERROR }]
    },
    {
      code: testClassPropFunction('_handleClick'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassPropFunction('handleClick_'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassPropFunction('__handleClick_'),
      errors: [{ message: UNDERSCOPE_ERROR }]
    },
    {
      code: testClassPropFunction('handleTestComponentClick'),
      errors: [{ message: LENGTH_ERROR }]
    }
  ]
})
