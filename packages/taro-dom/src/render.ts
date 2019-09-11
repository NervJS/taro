import { TaroNode } from './node'
import { isText } from './utils/is'
import { TaroElement } from './element'
import { Taro } from './text'

export interface MpInstance {
  dom: TaroNode;
  setData: (data: unknown, cb: () => void) => void;
}

export function hydrate (node: TaroElement | Taro) {
  if (isText(node)) {
    return {
      nodeValue: node.nodeValue,
      nodeName: node.nodeName
    }
  }

  return {
    cn: node.childNodes.map(hydrate),
    nodeName: node.nodeName,
    cl: node.className,
    style: node.cssText || '',
    uid: node.uid
  }
}

export function render (inst: MpInstance) {
  inst.dom.ctx = inst
  inst.dom.performUpdate()
}
