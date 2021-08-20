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

const { buildDocsMeta, isTaroComponent } = require('../utils/utils')

const NUMBER_ERROR = '方法名包含数字可能会在小程序中无法使用'
const UNDERSCOPE_ERROR = '方法名以下划线 `_` 开头或结尾可能在小程序无法使用'
const LENGTH_ERROR = '方法名的长度大于 22 可能在小程序中无法使用'

const lifeCycles = new Set([
  'shouldComponentUpdate',
  'getDerivedStateFromProps',
  'getSnapshotBeforeUpdate',
  'componentWillReceiveProps',
  'componentDidCatchError',
  'componentDidNotFound',
  'componentDidCatch'
])

module.exports = {
  meta: {
    docs: buildDocsMeta('方法命名规范', 'function-naming')
  },

  create (context) {
    function examine (key) {
      if (lifeCycles.has(key.name)) {
        return
      }
      if (/\d/g.test(key.name)) {
        context.report({
          message: NUMBER_ERROR,
          node: key
        })
      }
      if (key.name.startsWith('_') || key.name.endsWith('_')) {
        context.report({
          message: UNDERSCOPE_ERROR,
          node: key
        })
      }
      if (key.name.length >= 22) {
        context.report({
          message: LENGTH_ERROR,
          node: key
        })
      }
    }

    return {
      MethodDefinition (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const key = node.key
        if (key.type === 'Identifier') {
          examine(key)
        }
      },
      ClassProperty (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const key = node.key
        const value = node.value
        if (
          key.type === 'Identifier' &&
          value &&
          (value.type === 'ArrowFunctionExpression' || value.type === 'FunctionExpression')
        ) {
          examine(key)
        }
      }
    }
  }
}
