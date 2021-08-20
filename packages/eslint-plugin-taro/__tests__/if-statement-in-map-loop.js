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

const rule = require('../rules/if-statement-in-map-loop')
const { RuleTester } = require('eslint')
const { parserOptions, testValid, testInvalid } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在包含 JSX 元素的 map 循环中使用 if 表达式'

ruleTester.run('if-statement-in-map-loop', rule, {
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
    })`,
    `
    let content = null;
    if (loading) {
      content = <StatusIndicator fillPage={false} text={"加载中"} />;
  } else if (error) {
      content = <StatusIndicator fillPage={false} text={"出错了 点击重试"} />;
  } else if (_.isEmpty(requests)) {
      content = <StatusIndicator fillPage={false} text={"木有数据"} />;
  } else {
      content = (
          <View>
              {requests.map(r => <RoommateRequestCard key={r} request={r} />)}
          </View>
      );
  }
    `
  ]),
  invalid: testInvalid(ERROR_MESSAGE, [
    `numbers.map((number) => {
      const element = <View />
      let a = null
      const isOdd = number % 2
      if (isOdd) {
        a = <View />
      }
      return a
    })`,
    `numbers.map((number) => {
      const element = <View />
      let a = null
      const isOdd = number % 2
      if (isOdd) {
        <View />
      }
      return a
    })`,
    `numbers.map((number) => {
      const element = <View />
      let a = null
      const isOdd = number % 2
      if (isOdd) {
        return <Custom />
      }
      return a
    })`
  ])
})
