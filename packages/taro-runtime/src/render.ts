import { isText } from './utils'
import { TaroElement } from './dom/element'
import { TaroText } from './dom/text'
import { Shortcuts } from '@tarojs/shared'

export interface MpInstance {
  setData: (data: unknown, cb: () => void) => void;
  route?: string;
  __route__: string;
}

interface MiniElementData {
  [Shortcuts.Childnodes]: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]: string
  [Shortcuts.Style]: string
  uid: string
  [key: string]: unknown
}

interface MiniTextData {
  [Shortcuts.Text]: string
  [Shortcuts.NodeName]: string
}

export type MiniData = MiniElementData | MiniTextData

export type HydratedData = () => MiniData | MiniData[]

export function hydrate (node: TaroElement | TaroText): MiniData {
  if (isText(node)) {
    return {
      [Shortcuts.Text]: node.nodeValue,
      [Shortcuts.NodeName]: node.nodeName
    }
  }

  return {
    ...node.props,
    [Shortcuts.Childnodes]: node.childNodes.map(hydrate),
    [Shortcuts.NodeName]: node.nodeName,
    [Shortcuts.Class]: node.className,
    [Shortcuts.Style]: node.cssText || '',
    uid: node.uid
  }
}
