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

  const isFlexText = hmStyle.display === 'flex'
  let textAlign = hmStyle.textAlign
  let verticalAlign = hmStyle.verticalAlign

  // 按照 w3c 规范，一旦设置了 display: flex，textAlign 和 verticalAlign 都会直接失效
  // 需要使用 justifyContent 和 alignItems
  if (isFlexText) {
    switch (hmStyle.justifyContent) {
      case FlexAlign.Start:
        textAlign = TextAlign.Start
        break
      case FlexAlign.Center:
        textAlign = TextAlign.Center
        break
      case FlexAlign.End:
        textAlign = TextAlign.End
        break
      case FlexAlign.SpaceBetween:
      case FlexAlign.SpaceAround:
        textAlign = TextAlign.JUSTIFY
        break
      default:
        textAlign = TextAlign.Start
        break
    }
    switch (hmStyle.alignItems) {
      case ItemAlign.Start:
        verticalAlign = Alignment.Top
        break
      case ItemAlign.Center:
        verticalAlign = Alignment.Center
        break
      case ItemAlign.End:
        verticalAlign = Alignment.End
        break
      default:
        verticalAlign = Alignment.Top
        break
    }
  }

  const attributes: TaroAny = {
    textAlign,
    verticalAlign,
    WebkitLineClamp: WebkitLineClamp,
    // 已做处理的属性
    letterSpacing: hmStyle.letterSpacing,
    textOverflow: hmStyle.textOverflow,
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