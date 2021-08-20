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
import { allProps } from 'react-native-known-styling-properties'
import {
  kebabCase,
  namespace,
  isString,
  isCustomProperty,
  isStandardSyntaxProperty,
  isStandardSyntaxDeclaration,
  optionsMatches
} from '../../utils'

export const ruleName = namespace('style-property-no-unknown')

export const messages = utils.ruleMessages(ruleName, {
  rejected: property => `无效的 React Native 样式属性 "${property}"`
})

const props = allProps.map(kebabCase)

export default function (actual, options) {
  return function (root, result) {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual
      },
      {
        actual: options,
        possible: {
          ignoreProperties: [isString]
        },
        optional: true
      }
    )

    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop

      if (!isStandardSyntaxProperty(prop)) {
        return
      }

      if (!isStandardSyntaxDeclaration(decl)) {
        return
      }

      if (isCustomProperty(prop)) {
        return
      }

      if (optionsMatches(options, 'ignoreProperties', prop)) {
        return
      }

      if (props.indexOf(prop.toLowerCase()) !== -1) {
        return
      }

      utils.report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName
      })
    })
  }
}
