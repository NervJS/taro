import { isUndefined } from '@tarojs/shared'
import { ObjectAssign } from '@tarojs/runtime'

import { FlexManager } from './flexManager'

import type { StandardProps, TextProps } from '@tarojs/components/types'
import type { TaroAny, TaroElement, TaroStyleType, TaroTextStyleType, HarmonyStyle } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement): TaroTextStyleType {
  const hmStyle = node.hmStyle
  const attrs: TextProps = node._attrs || {}

  if (!hmStyle) return {}

  let lineHeight = hmStyle.lineHeight
  if (!isUndefined(hmStyle.verticalAlign)) {
    lineHeight = 0
  }

  let WebkitLineClamp = attrs.maxLines || hmStyle.WebkitLineClamp || Infinity
  if (hmStyle.textOverflow && !isUndefined(hmStyle.textOverflow.overflow)) {
    switch (hmStyle.textOverflow.overflow) {
      case TextOverflow.Clip: 
      case TextOverflow.Ellipsis:
      case TextOverflow.None: WebkitLineClamp = WebkitLineClamp || 1; break
      default: break
    }
  }

  const attributes: TaroAny = {
    WebkitLineClamp: WebkitLineClamp,
    // 已做处理的属性
    letterSpacing: hmStyle.letterSpacing,
    textAlign: hmStyle.textAlign,
    textOverflow: hmStyle.textOverflow,
    verticalAlign: hmStyle.verticalAlign,
    lineHeight: lineHeight
  }

  return attributes
}

// 模拟 div 自动撑满父元素的情况
export function isMaxWidthView (node: TaroElement) {
  const parentNode: TaroElement = node.parentNode as TaroElement

  return node.tagName === 'VIEW' && parentNode && parentNode.tagName === 'VIEW' &&
    !(FlexManager.isFlexNode(parentNode) && FlexManager.flexOptions(parentNode).direction !== FlexDirection.Column)
}

export function getNormalAttributes (node: TaroElement): HarmonyStyle {
  const hmStyle = node.hmStyle
  
  if (!hmStyle) return {}

  const _nid = node._nid
  const _attrs: StandardProps = node._attrs || {}

  let normalAttributes = hmStyle

  // 覆盖属性
  normalAttributes.id =  _attrs.id || _nid

  // taro_page 等写死在运行时里的节点，没有 _nodeInfo
  if (node._nodeInfo) {
    const overwriteStyle: TaroStyleType = node._nodeInfo?.overwriteStyle
    // 处理覆盖属性：如动画的覆盖
    if (overwriteStyle) {
      normalAttributes = ObjectAssign({}, normalAttributes, overwriteStyle)
    }
  }
  return normalAttributes
}


export function getStyleAttr(node: TaroElement | null, key: string): TaroAny {
  if (!node) return null
  const hmStyle = node.hmStyle
  if (!hmStyle) return null
  // 覆盖属性
  if (key === 'width') {
    return isMaxWidthView(node) && isUndefined(hmStyle.width) ? '100%' : hmStyle.width
  }
  return hmStyle[key]
}