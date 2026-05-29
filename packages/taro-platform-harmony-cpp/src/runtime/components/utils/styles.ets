import { isUndefined } from '@tarojs/shared'
import { ObjectAssign } from '@tarojs/runtime'

import { FlexManager } from './flexManager'

import type { StandardProps, TextProps } from '@tarojs/components/types'
import type { TaroAny, TaroElement, TaroTextStyleType, HarmonyStyle } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement): TaroAny {
}

// 模拟 div 自动撑满父元素的情况
export function isMaxWidthView (node: TaroElement) {
  const parentNode: TaroElement = node.parentNode as TaroElement

  return node.tagName === 'VIEW' && parentNode && parentNode.tagName === 'VIEW' && !FlexManager.isFlexNode(parentNode)
}

export function getNormalAttributes (node: TaroElement, initStyle?: HarmonyStyle): HarmonyStyle {
  if (!node) return {}

  const hmStyle: TaroAny = node.hmStyle
  if (!hmStyle) return {}

  const _nid = node._nid
  const _attrs: StandardProps = node._attrs || {}

  let normalAttributes: TaroAny = hmStyle

  // 覆盖属性
  normalAttributes.id = _attrs.id || _nid.toString()

  // 初始化默认的值
  if (initStyle) {
    normalAttributes = ObjectAssign({}, initStyle, normalAttributes)
  }
  return normalAttributes
}

export function getStyleAttr(node: TaroElement | null, key: string): TaroAny {
}
