import { isUndefined } from '@tarojs/shared'

import type { TaroElement } from '@tarojs/runtime'
import type { TaroAny, Func } from './type'

export const parseStyles = (styles = ''): Record<string, string> => {
  const styleObj: Record<string, string> = {}
  styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(new RegExp("/-./g"), c => c.substring(1).toUpperCase()),
    style.split(':')[1].trim()
    ])
    .forEach((style) => {
      const key = style[0]
      const value = style[1]
      styleObj[key] = value
    })
  return styleObj
}


export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null
  if (!node.__listeners) {
    return null
  }
  const listeners = Object.keys(node.__listeners)
  if (listeners.every(e => !eventNames.includes(e))) return null
  return cb
}

export function getNodeThresholds (node: TaroElement): number[] | null {
  if (!node) return

  const id = node._nid
  const instance: TaroAny = node._instance

  return instance?.nodeInfoMap?.[id]?.thresholds || null
}

export { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle } from './styles'
