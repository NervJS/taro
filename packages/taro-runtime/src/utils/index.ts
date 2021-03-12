import { TaroElement } from '../dom/element'
import { TaroText } from '../dom/text'
import { NodeType } from '../dom/node_types'
import { TaroNode } from '../dom/node'

export const incrementId = () => {
  let id = 0
  return () => (id++).toString()
}

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isText (node: TaroNode): node is TaroText {
  return node.nodeType === NodeType.TEXT_NODE
}

export function isHasExtractProp (el: TaroElement): boolean {
  const res = Object.keys(el.props).find(prop => {
    return !(/^(class|style|id)$/.test(prop) || prop.startsWith('data-'))
  })
  return Boolean(res)
}

/**
 * 往上寻找组件树直到 root，寻找是否有祖先组件绑定了同类型的事件
 * @param node 当前组件
 * @param type 事件类型
 */
export function isParentBinded (node: TaroElement | null, type: string): boolean {
  let res = false
  while (node?.parentElement && node.parentElement._path !== 'root') {
    if (node.parentElement.__handlers[type]?.length) {
      res = true
      break
    }
    node = node.parentElement
  }
  return res
}
