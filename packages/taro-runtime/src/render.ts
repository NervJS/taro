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
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
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

  const data: MiniData = {
    ...node.props,
    [Shortcuts.Childnodes]: node.childNodes.map(hydrate),
    [Shortcuts.NodeName]: node.nodeName,
    uid: node.uid
  }

  if (node.className) {
    data[Shortcuts.Class] = node.className
  }

  if (node.cssText) {
    data[Shortcuts.Style] = node.cssText
  }

  // eslint-disable-next-line dot-notation
  delete data['class']
  // eslint-disable-next-line dot-notation
  delete data['style']

  return data
}
