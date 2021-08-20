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

const rule = require('../rules/duplicate-name-of-state-and-props')
const { RuleTester } = require('eslint')
const { parserOptions } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions, parser: 'babel-eslint' })

function testConstructor (code) {
  return `class A extends Component {
    constructor () {
      this.state = {
        a: '',
        b: '',
        c: ''
      }
    }

    render () {
      ${code}
    }
  }`
}

function testClassProperty (code) {
  return `class A extends Component {
    state = {
      a: '',
      b: '',
      c: ''
    }

    render () {
      ${code}
    }
  }`
}

function buildErrMsg (name) {
  return `this.state.${name} 与 this.props.${name} 重复可能会导致渲染结不如意料之中的结果。`
}

ruleTester.run('duplicate-name-of-state-and-props', rule, {
  valid: [
    {
      code: testConstructor('this.props.e')
    },
    {
      code: testConstructor('this.props.f')
    },
    {
      code: testConstructor('this.props.aa')
    },
    {
      code: testConstructor('this.props.bb')
    },
    {
      code: testConstructor('this.a')
    },
    {
      code: testClassProperty('this.a')
    },
    {
      code: testClassProperty('this.props.e')
    },
    {
      code: testClassProperty('this.props.f')
    },
    {
      code: testClassProperty('this.props.aa')
    },
    {
      code: testClassProperty('this.props.bb')
    }
  ],
  invalid: [
    {
      code: testConstructor('this.props.a'),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testConstructor('this.props.b'),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testConstructor('this.props.c'),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testConstructor('const { c } = this.props'),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testConstructor('const { b } = this.props'),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testConstructor('const { a } = this.props'),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testClassProperty('this.props.a'),
      errors: [{ message: buildErrMsg('a') }]
    },
    {
      code: testClassProperty('this.props.b'),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testClassProperty('this.props.c'),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testClassProperty('const { c } = this.props'),
      errors: [{ message: buildErrMsg('c') }]
    },
    {
      code: testClassProperty('const { b } = this.props'),
      errors: [{ message: buildErrMsg('b') }]
    },
    {
      code: testClassProperty('const { a } = this.props'),
      errors: [{ message: buildErrMsg('a') }]
    }
  ]
})
