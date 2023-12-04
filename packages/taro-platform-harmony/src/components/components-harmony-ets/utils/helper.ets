import { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle } from './styles'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'
import type { TaroAny } from './type'

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
  if (!node) return null

  const id = node._nid
  const instance: TaroAny = node._instance

  return instance?.nodeInfoMap?.[id]?.thresholds || null
}


export function getTextAttributes (node: TaroElement) {
  const attrs = {
    ...getNormalAttributes(node),
    ...getFontAttributes(node)
  }

  transformW3CToHarmonyInStyle(node._st, attrs)

  return attrs
}


export { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle }
