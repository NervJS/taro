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

import rule, { messages, ruleName } from '..'

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: `
      .foo {
        line-height: 16px;
      }
      `,
      description: 'accepts line-height value with "px" unit'
    }, {
      code: `
      .foo {
        line-height: 16PX;
      }
      `,
      description: 'accepts line-height value with "PX" unit'
    }, {
      code: `
      .foo {
        line-height: 16vh;
      }
      `,
      description: 'accepts line-height value with "vh" unit'
    }, {
      code: `
      .foo {
        line-height: 16rem;
      }
      `,
      description: 'accepts line-height value with "rem" unit'
    }, {
      code: `
      .foo {
        line-height: 16.6px;
      }
      `,
      description: 'accepts line-height value with decimal value'
    }, {
      code: `
      .foo {
        line-height: -16px;
      }
      `,
      description: 'accepts line-height value with negative value'
    }, {
      code: `
      .foo {
        line-height: 1vh;
      }
      `,
      description: 'accepts line-height value with "vh" unit'
    }
  ],

  reject: [
    {
      code: `
      .foo {
        line-height: 1;
      }
      `,
      message: messages.rejected('1'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: -1;
      }
      `,
      message: messages.rejected('-1'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: 100%;
      }
      `,
      message: messages.rejected('100%'),
      line: 3,
      column: 22
    }, {
      code: `
      .foo {
        line-height: 100pt;
      }
      `,
      message: messages.rejected('100pt'),
      line: 3,
      column: 22
    }
  ]
})
