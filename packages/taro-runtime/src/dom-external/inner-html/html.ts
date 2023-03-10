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

import { options } from '../../options'
import { parser } from './parser'

import type { TaroNode } from '../../dom/node'

options.html = {
  skipElements: new Set(['style', 'script']),
  voidElements: new Set([
    '!doctype', 'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
  ]),
  closingElements: new Set([
    'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
    'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'
  ]),
  renderHTMLTag: false
}

export function setInnerHTML (element: TaroNode, html: string) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
  const children = parser(html, element.ownerDocument)

  for (let i = 0; i < children.length; i++) {
    element.appendChild(children[i])
  }
}
