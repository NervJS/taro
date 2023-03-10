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
 */

import { TaroElement } from '../dom/element'
import { TaroNode } from '../dom/node'
import { setInnerHTML } from '../dom-external/inner-html/html'
import { getBoundingClientRectImpl, getTemplateContent } from './element'
import { cloneNode, contains, insertAdjacentHTML } from './node'

declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_CLONE_NODE: boolean
declare const ENABLE_CONTAINS: boolean

declare const ENABLE_SIZE_APIS: boolean
declare const ENABLE_TEMPLATE_CONTENT: boolean

if (process.env.TARO_ENV !== 'h5') {
  if (ENABLE_INNER_HTML) {
    TaroNode.extend('innerHTML', {
      set (html: string) {
        setInnerHTML.call(this, this, html)
      },
      get (): string {
        return ''
      }
    })

    if (ENABLE_ADJACENT_HTML) {
      TaroNode.extend('insertAdjacentHTML', insertAdjacentHTML)
    }
  }

  if (ENABLE_CLONE_NODE) {
    TaroNode.extend('cloneNode', cloneNode)
  }

  if (ENABLE_CONTAINS) {
    TaroNode.extend('contains', contains)
  }

  if (ENABLE_SIZE_APIS) {
    TaroElement.extend('getBoundingClientRect', getBoundingClientRectImpl)
  }

  if (ENABLE_TEMPLATE_CONTENT) {
    TaroElement.extend('content', {
      get () {
        return getTemplateContent(this)
      }
    })
  }
}
