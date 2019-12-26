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
  [Shortcuts.Childnodes]?: MiniData[]
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

/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
export function hydrate (node: TaroElement | TaroText): MiniData {
  if (isText(node)) {
    return {
      [Shortcuts.Text]: node.nodeValue,
      [Shortcuts.NodeName]: node.nodeName
    }
  }

  const data: MiniElementData = {
    [Shortcuts.NodeName]: node.nodeName,
    uid: node.uid
  }

  for (const prop in node.props) {
    if (
      !prop.startsWith('data-') && // 在 node.dataset 的数据
      prop !== 'class' &&
      prop !== 'style'
    ) {
      data[prop] = node[prop]
    }
  }

  if (node.childNodes.length > 0) {
    data[Shortcuts.Childnodes] = node.childNodes.map(hydrate)
  }

  if (node.className !== '') {
    data[Shortcuts.Class] = node.className
  }

  if (node.cssText !== '') {
    data[Shortcuts.Style] = node.cssText
  }

  return data
}
