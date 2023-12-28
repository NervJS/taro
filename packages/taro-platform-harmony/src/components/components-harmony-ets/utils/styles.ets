import { ObjectAssign } from '@tarojs/runtime'

import { TEXT_DEFAULT_STYLE } from './constant/style'

import type { StandardProps } from '@tarojs/components/types'
import type { TaroAny, TaroElement, TaroStyleType, TaroTextStyleType, HarmonyType, HarmonyStyle } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement): TaroTextStyleType {
  const hmStyle = node.hmStyle
  const attrs = node._attrs || {}

  const attributes: TaroAny = {
    WebkitLineClamp: attrs.maxLines || hmStyle.WebkitLineClamp || Infinity,
    // 已做处理的属性
    letterSpacing: hmStyle.letterSpacing,
    textAlign: hmStyle.textAlign,
    textOverflow: hmStyle.textOverflow
  }

  return attributes
}

export function getNormalAttributes (node: TaroElement): TaroStyleType {
  const hmStyle = node.hmStyle

  const _nid = node._nid
  const _attrs: StandardProps = node._attrs || {}

  let linearGradient: HarmonyType.LinearGradient | undefined = undefined
  // 渐变
  if (hmStyle.backgroundImage?.colors) {
    linearGradient = hmStyle.backgroundImage
  }

  let normalAttributes: HarmonyStyle = {
    // Flex相关
    flexBasis: hmStyle.flexBasis,
    flexGrow: hmStyle.flexGrow,
    flexShrink: hmStyle.flexShrink,
    alignSelf: hmStyle.alignSelf,
    // 尺寸相关
    width: hmStyle.width,
    height: hmStyle.height,
    minHeight: hmStyle.minHeight,
    maxHeight: hmStyle.maxHeight,
    minWidth: hmStyle.minWidth,
    maxWidth: hmStyle.maxWidth,
    marginTop: hmStyle.marginTop,
    marginRight: hmStyle.marginRight,
    marginBottom: hmStyle.marginBottom,
    marginLeft: hmStyle.marginLeft,
    paddingTop: hmStyle.paddingTop,
    paddingRight: hmStyle.paddingRight,
    paddingBottom: hmStyle.paddingBottom,
    paddingLeft: hmStyle.paddingLeft,
    // 边框相关
    borderStyle: hmStyle.borderStyle,
    borderTopStyle: hmStyle.borderTopStyle,
    borderRightStyle: hmStyle.borderRightStyle,
    borderBottomStyle: hmStyle.borderBottomStyle,
    borderLeftStyle: hmStyle.borderLeftStyle,
    borderWidth: hmStyle.borderWidth,
    borderTopWidth: hmStyle.borderTopWidth,
    borderRightWidth: hmStyle.borderRightWidth,
    borderBottomWidth: hmStyle.borderBottomWidth,
    borderLeftWidth: hmStyle.borderLeftWidth,
    borderColor: hmStyle.borderColor,
    borderTopColor: hmStyle.borderTopColor,
    borderRightColor: hmStyle.borderRightColor,
    borderBottomColor: hmStyle.borderBottomColor,
    borderLeftColor: hmStyle.borderLeftColor,
    borderRadius: hmStyle.borderRadius,
    borderTopLeftRadius: hmStyle.borderTopLeftRadius,
    borderTopRightRadius: hmStyle.borderTopRightRadius,
    borderBottomRightRadius: hmStyle.borderBottomRightRadius,
    borderBottomLeftRadius: hmStyle.borderBottomLeftRadius,
    // 背景相关
    backgroundColor: hmStyle.backgroundColor,
    backgroundImage: hmStyle.backgroundImage,
    backgroundSize: hmStyle.backgroundSize,
    backgroundRepeat: hmStyle.backgroundRepeat,
    backgroundPosition: hmStyle.backgroundPosition,
    linearGradient,
    // 变换相关
    transform: hmStyle.transform,
    transformOrigin: {
      x: hmStyle.transformOrigin?.x || 0,
      y: hmStyle.transformOrigin?.y || 0
    },
    // 通用文本相关
    color: hmStyle.color,
    fontSize: hmStyle.fontSize,
    fontStyle: hmStyle.fontStyle,
    fontWeight: hmStyle.fontWeight,
    fontFamily: hmStyle.fontFamily || TEXT_DEFAULT_STYLE.FONT_FAMILY,
    lineHeight: hmStyle.lineHeight,
    textDecoration: hmStyle.textDecoration,
    // 其他
    overflow: hmStyle.overflow,
    id: _attrs.id || _nid,
    opacity: hmStyle.opacity,
    // focus: _attrs.focus || false,
  }

  // taro_page 等写死在运行时里的节点，没有 _nodeInfo
  if (node._nodeInfo) {
    const overwriteStyle: TaroStyleType = node._nodeInfo?.overwriteStyle

    // 处理覆盖属性：如动画的覆盖
    if (overwriteStyle) {
      normalAttributes = ObjectAssign(normalAttributes, overwriteStyle)
    }
  }
  return normalAttributes
}
