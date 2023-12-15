import { ObjectAssign } from '@tarojs/runtime'

import { TEXT_DEFAULT_STYLE } from './constant/style'

import type { StandardProps } from '@tarojs/components/types'
import type { TaroAny, TaroElement, TaroStyleType, TaroTextStyleType, HarmonyType, HarmonyStyle } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement): TaroTextStyleType {
  const hmStyle = node.hmStyle

  const attributes: TaroAny = {
    maxLines: hmStyle.maxLines || Infinity,
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

  const transform: TaroAny = hmStyle.transform
  const transformRotate: HarmonyType.Transform.Rotate = transform?.rotate?.[0]
  const transformTranslate: HarmonyType.Transform.Translate = transform?.translate?.[0]
  const transformScale: HarmonyType.Transform.Scale = transform?.scale?.[0]
  const transformTransform: HarmonyType.Transform.Transform = transform?.transform?.[0]

  let normalAttributes: HarmonyStyle = {
    // Flex相关
    flexBasis: hmStyle.flexBasis,
    flexGrow: hmStyle.flexGrow,
    flexShrink: hmStyle.flexShrink,
    alignSelf: hmStyle.alignSelf,
    // 尺寸相关
    width: hmStyle.width,
    height: hmStyle.height,
    constraintSize: hmStyle.constraintSize,
    margin: hmStyle.margin,
    padding: hmStyle.padding,
    // 边框相关
    borderStyle: hmStyle.borderStyle,
    borderWidth: hmStyle.borderWidth,
    borderColor: hmStyle.borderColor,
    borderRadius: hmStyle.borderRadius,
    // 背景相关
    backgroundColor: hmStyle.backgroundColor,
    backgroundImage: hmStyle.backgroundImage,
    backgroundImageSize: hmStyle.backgroundImageSize,
    backgroundRepeat: hmStyle.backgroundRepeat,
    linearGradient: hmStyle.linearGradient,
    // 变换相关
    rotate: transformRotate,
    translate: transformTranslate,
    scale: transformScale,
    transform: transformTransform,
    // 通用文本相关
    color: hmStyle.color,
    fontSize: hmStyle.fontSize,
    fontStyle: hmStyle.fontStyle,
    fontWeight: hmStyle.fontWeight,
    fontFamily: hmStyle.fontFamily || TEXT_DEFAULT_STYLE.FONT_FAMILY,
    lineHeight: hmStyle.lineHeight,
    decoration: hmStyle.decoration,
    // 其他
    clip: hmStyle.clip,
    id: _attrs.id || _nid,
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
