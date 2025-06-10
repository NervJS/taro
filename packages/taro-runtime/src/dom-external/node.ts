import { DATASET, OBJECT, PROPS, STYLE } from '../constants'
import { NodeType } from '../dom/node_types'
import { parser } from '../dom-external/inner-html/parser'

import type { TaroNode } from '../dom/node'

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
    // eslint-disable-next-line valid-typeof
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
