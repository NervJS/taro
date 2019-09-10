import { MpNode } from './node'
import { isText } from './utils/is'
import { MpElement } from './element'
import { MpText } from './text'

export interface MpInstance {
  dom: MpNode;
  setData: (data: unknown, cb: () => void) => void;
}

export function hydrate (node: MpElement | MpText) {
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
