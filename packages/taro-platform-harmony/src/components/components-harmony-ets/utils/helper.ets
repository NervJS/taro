import { isUndefined } from '@tarojs/shared'
import { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle } from './styles'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export const parseStyles = (styles = ''): { [key: string]: string } => {
  return styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(/-./g, c => c.substring(1).toUpperCase()),
    style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
      ...styleObj,
      [style[0]]: style[1],
    }), {})
}


export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null

  const listeners = Object.keys(node.__listeners || {})
  if (listeners.every(e => !eventNames.includes(e))) return null

  return cb
}

export function getNodeAttributeOrNull (node: TaroElement, key: string) {
  const value = node?._attrs?.[key]
  const isValueExist = !isUndefined(value)

  return isValueExist ? value : null
}

export function getNodeThresholds (node: TaroElement) {
  if (!node) return

  const id = node._nid
  const component = node._instance

  return component?.nodeInfoMap?.[id]?.thresholds || null
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
