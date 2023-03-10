/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import { allCSS2RNProps } from 'react-native-known-styling-properties'
import { utils } from 'stylelint'

import {
  isCustomProperty,
  isExportBlock,
  isStandardSyntaxDeclaration,
  isStandardSyntaxProperty,
  isString,
  kebabCase,
  namespace,
  optionsMatches
} from '../../utils'

export const ruleName = namespace('css-property-no-unknown')

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property) => `无效的 React Native 样式属性 "${property}"`
})

const props = allCSS2RNProps.map(kebabCase)

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

    root.walkDecls((decl) => {
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

      if (isExportBlock(decl.parent)) {
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
