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

import { DATASET, OBJECT, PROPS, STYLE } from '../constants'
import { NodeType } from '../dom/node_types'
import { parser } from '../dom-external/inner-html/parser'

import type { TaroNode } from 'src/dom/node'

export type IPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

/**
 * An implementation of `Element.insertAdjacentHTML()`
 * to support Vue 3 with a version of or greater than `vue@3.1.2`
 */
export function insertAdjacentHTML (
  this: TaroNode,
  position: IPosition,
  html: string
) {
  const parsedNodes = parser(html, this.ownerDocument)

  for (let i = 0; i < parsedNodes.length; i++) {
    const n = parsedNodes[i]

    switch (position) {
      case 'beforebegin':
        this.parentNode?.insertBefore(n, this)
        break
      case 'afterbegin':
        if (this.hasChildNodes()) {
          this.insertBefore(n, this.childNodes[0])
        } else {
          this.appendChild(n)
        }
        break
      case 'beforeend':
        this.appendChild(n)
        break
      case 'afterend':
        this.parentNode?.appendChild(n)
        break
    }
  }
}

export function cloneNode (this: TaroNode, isDeep = false) {
  const document = this.ownerDocument
  let newNode

  if (this.nodeType === NodeType.ELEMENT_NODE) {
    newNode = document.createElement(this.nodeName)
  } else if (this.nodeType === NodeType.TEXT_NODE) {
    newNode = document.createTextNode('')
  }

  for (const key in this) {
    const value: any = this[key]
    if ([PROPS, DATASET].includes(key) && typeof value === OBJECT) {
      newNode[key] = { ...value }
    } else if (key === '_value') {
      newNode[key] = value
    } else if (key === STYLE) {
      newNode.style._value = { ...value._value }
      newNode.style._usedStyleProp = new Set(Array.from(value._usedStyleProp))
    }
  }

  if (isDeep) {
    newNode.childNodes = this.childNodes.map(node => (node as any).cloneNode(true))
  }

  return newNode
}

export function contains (this: TaroNode, node: TaroNode & { id?: string }): boolean {
  let isContains = false
  this.childNodes.some(childNode => {
    const { uid } = childNode
    if (uid === node.uid || uid === node.id || (childNode as any).contains(node)) {
      isContains = true
      return true
    }
  })
  return isContains
}
