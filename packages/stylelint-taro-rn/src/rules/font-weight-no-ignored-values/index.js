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

import { utils } from 'stylelint'

import { namespace } from '../../utils'

const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')

export const ruleName = namespace('font-weight-no-ignored-values')

export const messages = utils.ruleMessages(ruleName, {
  rejected: (weight) => `Unexpected font-weight "${weight}"`
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

    root.walkDecls(/^font-weight$/i, (decl) => {
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
