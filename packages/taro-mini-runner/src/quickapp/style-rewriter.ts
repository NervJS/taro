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
import rewriteRule from './style'

interface StyleLog {
  line: number;
  column: number;
  reason: string;
}

export default function rewriter (code, isProduction?) {
  const logs: StyleLog[] = []
  const ast = css.parse(code, {
    silent: true
  })
  // catch syntax error
  if (ast.stylesheet.parsingErrors && ast.stylesheet.parsingErrors.length) {
    ast.stylesheet.parsingErrors.forEach(function (error) {
      logs.push({
        line: error.line,
        column: error.column,
        reason: error.toString()
      })
    })
  }
  // 针对快应用样式进行转换
  if (ast && ast.type === 'stylesheet' && ast.stylesheet &&
        ast.stylesheet.rules && ast.stylesheet.rules.length) {
    const rules: any = []
    ast.stylesheet.rules.forEach(function (rule) {
      const type = rule.type
      if (type === 'rule') {
        const newRule = rewriteRule(rule, {
          logs: logs
        })
        if (newRule) {
          rules.push(newRule)
        }
      } else {
        rules.push(rule)
      }
    })
    ast.stylesheet.rules = rules
  }
  if (!ast) {
    return ''
  }
  // 输出转换结果
  try {
    const resContent = css.stringify(ast, {
      compress: !!isProduction
    })
    return resContent
  } catch (e) {
    return ''
  }
}
