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

const has = require('has')

const allRules = {
  // 'if-statement-in-map-loop': require('./if-statement-in-map-loop'),
  'manipulate-jsx-as-array': require('./manipulate-jsx-as-array'),
  // 'no-jsx-in-class-method': require('./no-jsx-in-class-method'),
  'no-spread-in-props': require('./no-spread-in-props'),
  // 'no-stateless-component': require('./no-stateless-component'),
  // 'jsx-handler-names': require('./jsx-handler-names'),
  'reserve-class-properties': require('./reserve-class-properties'),
  // 'function-naming': require('./function-naming'),
  'class-naming': require('./class-naming'),
  'props-reserve-keyword': require('./props-reserve-keyword'),
  'this-props-function': require('./this-props-function'),
  'render-props': require('./render-props'),
  'duplicate-name-of-state-and-props': require('./duplicate-name-of-state-and-props')
}

const transformerDisableRules = new Set([
  'this-props-function',
  'props-reserve-keyword'
])

function configureAsError (rules, isTransformer) {
  const result = {}
  for (const key in rules) {
    if (!has(rules, key)) {
      continue
    }
    if (isTransformer && transformerDisableRules.has(key)) {
      continue
    }
    result[`taro/${key}`] = 2
  }
  return result
}

const transformerRules = configureAsError(allRules, true)

const activeRules = configureAsError(allRules)

module.exports = {
  activeRules,
  allRules,
  transformerRules
}
