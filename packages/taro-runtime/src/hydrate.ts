import { isText } from './utils'
import { TaroElement } from './dom/element'
import { TaroText } from './dom/text'
import { Shortcuts, toCamelCase } from '@tarojs/shared'
import type { PageConfig } from '@tarojs/taro'

export interface MpInstance {
  config: PageConfig
  setData: (data: unknown, cb: () => void) => void;
  route?: string;
  __route__: string;
  options?: Record<string, unknown>
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
  const { props, childNodes } = node

  if (!node.isAnyEventBinded()) {
    if (node.nodeName === 'view') {
      const isExtractProp = Object.keys(props).find(prop => {
        return !(/class|style|id/.test(prop) || prop.startsWith('data-'))
      })
      if (isExtractProp) {
        data[Shortcuts.NodeName] = 'static-view'
      } else {
        data[Shortcuts.NodeName] = 'pure-view'
      }
    }
    if (node.nodeName === 'text') {
      data[Shortcuts.NodeName] = 'static-text'
    }
    if (node.nodeName === 'image') {
      data[Shortcuts.NodeName] = 'static-image'
    }
  }

  for (const prop in props) {
    const propInCamelCase = toCamelCase(prop)
    if (
      !prop.startsWith('data-') && // 在 node.dataset 的数据
      prop !== 'class' &&
      prop !== 'style' &&
      prop !== 'id' &&
      propInCamelCase !== 'catchMove'
    ) {
      data[propInCamelCase] = props[prop]
    }
    if (node.nodeName === 'view' && propInCamelCase === 'catchMove' && props[prop] !== 'false') {
      data[Shortcuts.NodeName] = 'catch-view'
    }
  }

  if (childNodes.length > 0) {
    data[Shortcuts.Childnodes] = childNodes.map(hydrate)
  }

  if (node.className !== '') {
    data[Shortcuts.Class] = node.className
  }

  if (node.cssText !== '' && node.nodeName !== 'swiper-item') {
    data[Shortcuts.Style] = node.cssText
  }

  return data
}
