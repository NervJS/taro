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

import { CallExpression } from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'

export class InjectDefineConfigHeader extends Visitor {
  visitTsType (expression) {
    return expression
  }

  visitCallExpression (expression: CallExpression) {
    const callee = expression.callee
    if (callee.type === 'Identifier' && (callee.value === 'definePageConfig' || callee.value === 'defineAppConfig')) {
      return expression.arguments[0].expression
    }

    return expression
  }
}

interface ICreateSwcRegisterParam {
  only
  plugins?: [string, any][]
}

export default function createSwcRegister ({ only, plugins }: ICreateSwcRegisterParam) {
  const config: Record<string, any> = {
    only: Array.from(new Set([...only])),
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true
      },
      transform: {
        legacyDecorator: true
      }
    },
    module: {
      type: 'commonjs'
    }
  }

  if (plugins) {
    config.jsc.experimental = {
      plugins
    }
  }

  require('@swc/register')(config)
}
