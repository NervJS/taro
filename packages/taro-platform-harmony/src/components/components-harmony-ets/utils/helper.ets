import { VIEW } from '@tarojs/runtime'

import { getNormalAttributes, getFontAttributes, getStyleAttr } from './styles'

import type { TaroAny, TaroElement, TaroNode } from '@tarojs/runtime'

export const parseStyles = (styles = ''): Record<string, string> => {
  const styleObj: Record<string, string> = {}
  styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(new RegExp("-([a-z])", "g"), (_, letter: string): string => letter.toUpperCase()),
    style.split(':')[1].trim()
    ])
    .forEach((style) => {
      const key = style[0]
      const value = style[1]
      styleObj[key] = value
    })
  return styleObj
}

export function shouldBindEvent (cb: TaroAny, node: TaroElement | null, eventNames: string[], disabled = false): TaroAny {
  if (!node || node._attrs?.disabled || disabled) return null
  if (!node.__listeners) {
    return null
  }
  const listeners = Object.keys(node.__listeners)
  if (listeners.every(e => !eventNames.includes(e))) return null
  return cb
}

export function getNodeThresholds (node: TaroElement): number[] | null {
  return node?._nodeInfo?.thresholds || null
}

export function isTagFirstChild (node: TaroElement, tagName = VIEW, level = 0): boolean {
  const parent: TaroElement | null = node.parentElement
  const list: TaroNode[] = node.parentNode?.childNodes || []
  if (list.length < 1 || level < 0) return false
  else if (!parent) return true

  if (parent.nodeName === tagName.toUpperCase()) {
    return list[0] === node
  } else {
    return (list[0] === node) && isTagFirstChild(parent, tagName, --level)
  }
}

export { getNormalAttributes, getFontAttributes, getStyleAttr }
