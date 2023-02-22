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

import * as t from 'babel-types'

import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { parseScript } from './script'
import { setting } from './utils'
import { parseVue } from './vue'
import { parseWXML } from './wxml'

interface Option {
  json?: string
  script?: string
  wxml?: string
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  isApp?: boolean
}

export function parse (option: Option) {
  resetGlobals()
  setting.rootPath = option.rootPath
  if (option.json) {
    const config = JSON.parse(option.json)
    const usingComponents = config.usingComponents
    if (usingComponents) {
      for (const key in usingComponents) {
        if (usingComponents.hasOwnProperty(key)) {
          THIRD_PARTY_COMPONENTS.add(key)
        }
      }
    }
  }

  if (option.framework === 'vue') {
    const result = parseVue(option.path, option.wxml || '', option.script)
    return {
      ...result,
      errors
    }
  }

  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, wxml as t.Expression, wxses, refIds, option.isApp)
  return {
    ast,
    imports,
    errors
  }
}
