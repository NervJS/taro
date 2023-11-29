import { NodeType } from './node'

import type { TaroElement } from './element'

type Filter<T = TaroElement> = (element: T) => boolean

function returnTrue () {
  return true
}

export function treeToArray<T = TaroElement> (root: TaroElement, predict?: Filter<T>): T[] {
  const array: T[] = []
  const filter = predict ?? returnTrue

  let object: T | null = root

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
