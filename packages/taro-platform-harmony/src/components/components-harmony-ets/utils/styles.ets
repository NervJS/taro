import { isUndefined } from '@tarojs/shared'
import { ObjectAssign } from '@tarojs/runtime'

import { FlexManager } from './flexManager'

import type { StandardProps, TextProps } from '@tarojs/components/types'
import type { TaroAny, TaroElement, TaroTextStyleType, HarmonyStyle } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement): TaroTextStyleType {
  let hmStyle = getNormalAttributes(node)
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

  return node.tagName === 'VIEW' && parentNode && parentNode.tagName === 'VIEW' && !FlexManager.isFlexNode(parentNode)
}

export function getNormalAttributes (node: TaroElement, initStyle?: HarmonyStyle): HarmonyStyle {
  if (!node) return {}

  const hmStyle = node.hmStyle
  if (!hmStyle) return {}

  const _nid = node._nid
  const _attrs: StandardProps = node._attrs || {}

  let normalAttributes = hmStyle

  // 覆盖属性
  normalAttributes.id = _attrs.id || _nid.toString()

  let pseudoStylesheet = getPseudoClass(node)
  if (pseudoStylesheet) {
    normalAttributes = ObjectAssign({}, normalAttributes, pseudoStylesheet)
  }

  // 初始化默认的值
  if (initStyle) {
    normalAttributes = ObjectAssign({}, initStyle, normalAttributes)
  }
  return normalAttributes
}

// 应用伪类样式
function getPseudoClass (node: TaroElement): HarmonyStyle | null {
  // 伪类
  const _pseudo_class = Object.keys(node._pseudo_class)
  if (_pseudo_class.length) {
    for (let i = 0; i < _pseudo_class.length; i++) {
      const pseudoKey = _pseudo_class[i]
      const pseudoStylesheet = node._pseudo_class[pseudoKey]
      if (!pseudoStylesheet) continue
      switch(pseudoKey) {
        case "::first-child": {
          if (node.parentNode?.firstChild?._nid === node._nid) {
            return pseudoStylesheet.hmStyle
          }
          break
        }
        case "::last-child": {
          if (node.parentNode?.lastChild?._nid === node._nid) {
            return pseudoStylesheet.hmStyle
          }
          break
        }
        case "::empty": {
          if (node.children?.length === 0) {
            return pseudoStylesheet.hmStyle
          }
          break
        }
        default: {
          // 解析nth-child()
          // 找出当前节点在父节点中的位置
          // 公式
          let matchs: [number, number] | null = null
          if (pseudoKey === '::nth-child(odd)') {
            matchs = [2, 1]
          } else if (pseudoKey === '::nth-child(even)') {
            matchs = [2, 0]
          } else {
            matchs = parseNthChild(pseudoKey)
          }
          if (matchs) {
            let index = node.parentNode?.childNodes.findIndex((child) => child._nid === node._nid)
            if (isUndefined(index)) return null
            else {
              index = index + 1
              if (matchs[0] === 0) {
                if (index === matchs[1]) {
                  return pseudoStylesheet.hmStyle
                }
              } else {
                if ((index - matchs[1]) % matchs[0] === 0) {
                  return pseudoStylesheet.hmStyle
                }
              }
            }
          }
        }
      }
    }
  }
  return null
}

// 正则匹配nth-child
function parseNthChild(selector: string): [number, number] | null {
  const regex = /nth-child\((?:(-?\d*)n\s*)?([+-]?\s*\d+)?\)/;
  const match = selector.match(regex);

  if (match) {
      const a = match[1] ? parseInt(match[1]) : 0;
      const b = match[2] ? parseInt(match[2]) : 0;
      return [a, b];
  } else {
      return null;
  }
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
