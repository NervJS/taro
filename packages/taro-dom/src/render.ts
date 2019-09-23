import { isText } from './utils/is'
import { TaroElement } from './element'
import { TaroText } from './text'
import { TaroRootElement } from './root'
import { Current } from './current'

export interface MpInstance {
  dom: TaroRootElement;
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
    cn: node.childNodes.map(hydrate),
    nodeName: node.nodeName,
    cl: node.className,
    style: node.cssText! || '',
    uid: node.uid
  }
}

export function render (inst: MpInstance) {
  Current.root = inst.dom
  inst.dom.ctx = inst
  inst.dom.performUpdate()
}
