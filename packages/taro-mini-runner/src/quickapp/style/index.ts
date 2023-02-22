/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
 */

import * as css from 'css'

import rewriteSelector from './selector'
import rewriteDeclaration from './declaration'

import {
  comment,
  addComment,
  addDeclaration,
  removeDeclaration
} from './util'

export default function rewriter (rule, output) {
  output.declaration = {
    deleted: [],
    inserted: []
  }
  const selectors = rule.selectors.map(selector => rewriteSelector(selector, rule, output)).filter(v => !!v)

  if (!selectors.length) {
    let commentCssCode = ''
    try {
      commentCssCode = css.stringify({
        stylesheet: {
          rules: [rule]
        }
      })
    } catch (e) {
      output.logs.push({
        reason: 'E:转换失败',
        line: rule.position.start.line,
        column: rule.position.start.column
      })
    }
    return {
      type: 'comment',
      comment: `
${comment('unsupported selector', 'https://doc.quickapp.cn/widgets/common-styles.html')}
${commentCssCode}
`
    }
  }
  rule.selectors = selectors
  rule.declarations.forEach(declaration => declaration.type === 'declaration' && rewriteDeclaration(declaration, rule, output))
  // delete
  output.declaration.deleted.forEach(declaration => removeDeclaration(declaration, rule))
  // insert declaration
  output.declaration.inserted.forEach(declaration => addDeclaration(declaration.property, declaration.value, rule))
  // insert comment(by delete)
  output.declaration.deleted.forEach(declaration => addComment(declaration.property, declaration.value, rule))
  return rule
}
