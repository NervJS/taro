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

import { utils } from 'stylelint'
import { namespace } from '../../utils'

const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')

export const ruleName = namespace('font-weight-no-ignored-values')

export const messages = utils.ruleMessages(ruleName, {
  rejected: weight => `Unexpected font-weight "${weight}"`
})

const acceptedWeights = ['400', '700', 'normal', 'bold']

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual
    })

    if (!validOptions) {
      return
    }

    root.walkDecls(/^font-weight$/i, decl => {
      if (acceptedWeights.indexOf(decl.value) > -1) {
        return
      }

      const weightValueOffset = decl.value.indexOf(decl.value)
      const index = declarationValueIndex(decl) + weightValueOffset

      utils.report({
        message: messages.rejected(decl.value),
        node: decl,
        result,
        ruleName,
        index
      })
    })
  }
}
