import { isText } from './utils/is'
import { TaroElement } from './dom/element'
import { TaroText } from './dom/text'
import { TaroRootElement } from './dom/root'
import { Current } from './current'
import { document } from './bom/document'

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

export function render (derivedIDfromCompiler: string, inst: MpInstance) {
  Current.pages.add(derivedIDfromCompiler)
  Current.activeId = derivedIDfromCompiler
  const page = document.getElementById(Current.activeId)! as TaroRootElement
  Current.root = page
  page.ctx = inst
  page.performUpdate()
}
