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

import { DOCUMENT_FRAGMENT } from '../constants'
import { options } from '../options'

import type { TaroElement } from 'src/dom/element'

export function getBoundingClientRectImpl (this: TaroElement): Promise<null> {
  if (!options.miniGlobal) return Promise.resolve(null)
  return new Promise(resolve => {
    const query = options.miniGlobal.createSelectorQuery()
    query.select(`#${this.uid}`).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}

export function getTemplateContent (ctx: TaroElement): TaroElement | undefined {
  if (ctx.nodeName === 'template') {
    const document = ctx.ownerDocument
    const content: TaroElement = document.createElement(DOCUMENT_FRAGMENT)
    content.childNodes = ctx.childNodes
    ctx.childNodes = [content]
    content.parentNode = ctx
    content.childNodes.forEach(nodes => {
      nodes.parentNode = content
    })
    return content
  }
}
