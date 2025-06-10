import { NodeType } from './node_types'

import type { TaroElement } from './element'

type Filter = (element: TaroElement) => boolean

function returnTrue () {
  return true
}

export function treeToArray (root: TaroElement, predict?: Filter): TaroElement[] {
  const array: TaroElement[] = []
  const filter = predict ?? returnTrue

  let object: TaroElement | null = root

  while (object) {
    if (object.nodeType === NodeType.ELEMENT_NODE && filter(object)) {
      array.push(object)
    }

    object = following(object, root)
  }

  return array
}

function following (el: TaroElement, root: TaroElement): TaroElement | null {
  const firstChild = el.firstChild
  const isElmentTypeValid = el.nodeType === NodeType.ELEMENT_NODE || el.nodeType === NodeType.DOCUMENT_NODE

  // 如果当前 el 不是 element 或 document 元素，则可以直接不递归他的子元素了
  if (firstChild && isElmentTypeValid) {
    return firstChild as TaroElement
  }

  let current: TaroElement | null = el

  do {
    if (current === root) {
      return null
    }

    const nextSibling = current.nextSibling

    if (nextSibling) {
      return nextSibling as TaroElement
    }
    current = current.parentElement
  } while (current)

  return null
}
