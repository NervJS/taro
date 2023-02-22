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
 *  SOFTWARE.
 */

import rule, { messages, ruleName } from '..'

const acceptedWeights = ['400', '700', 'normal', 'bold']
const rejectedWeights = ['100', '200', '300', '500', '600', '800', '900']

testRule(rule, {
  ruleName,
  config: [true],

  accept: acceptedWeights.map(w => {
    return {
      code: `
      .foo {
        font-weight: ${w};
      }
      `,
      description: `font-weight: ${w}`
    }
  }),

  reject: rejectedWeights.map(w => {
    return {
      code: `
      .foo {
        font-weight: ${w};
      }
      `,
      description: `font-weight: ${w}`,
      message: messages.rejected(w),
      line: 3,
      column: 22
    }
  })
})
