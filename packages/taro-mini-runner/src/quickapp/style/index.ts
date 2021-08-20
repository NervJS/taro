/*!
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
