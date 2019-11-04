import { isText } from './utils'
import { TaroElement } from './dom/element'
import { TaroText } from './dom/text'

export interface MpInstance {
  setData: (data: unknown, cb: () => void) => void;
}

export function hydrate (node: TaroElement | TaroText) {
  if (isText(node)) {
    return {
      nodeValue: node.nodeValue,
      nodeName: node.nodeName
    }
  }

  return {
    ...node.props,
    cn: node.childNodes.map(hydrate),
    nodeName: node.nodeName,
    cl: node.className,
    style: node.cssText || '',
    uid: node.uid
  }
}
