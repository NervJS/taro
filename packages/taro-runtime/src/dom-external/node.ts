import {
  STYLE,
  DATASET,
  PROPS,
  OBJECT
} from '../constants'
import { parser } from '../dom-external/inner-html/parser'
import { GetDoc } from '../interface'
import { NodeType } from '../dom/node_types'

import type { Ctx } from '../interface'

export type IPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

/**
 * An implementation of `Element.insertAdjacentHTML()`
 * to support Vue 3 with a version of or greater than `vue@3.1.2`
 */
export function insertAdjacentHTMLImpl (
  position: IPosition,
  html: string,
  getDoc: GetDoc
) {
  const parsedNodes = parser(html, getDoc())

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

export function cloneNode (ctx: Ctx, getDoc, isDeep = false) {
  const document = getDoc()
  let newNode

  if (ctx.nodeType === NodeType.ELEMENT_NODE) {
    newNode = document.createElement(ctx.nodeName)
  } else if (ctx.nodeType === NodeType.TEXT_NODE) {
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
    newNode.childNodes = ctx.childNodes.map(node => node.cloneNode(true))
  }

  return newNode
}
