import { ObjectAssign } from '@tarojs/runtime'

import { AttributeManager } from './AttributeManager'
import { TEXT_DEFAULT_STYLE } from './constant/style'

import type { TaroAny, TaroElement, TaroStyleType, TaroTextStyleType, HarmonyType, HarmonyStyle } from '@tarojs/runtime'
import type { StandardProps } from '@tarojs/components/types'

export function getFontAttributes (node: TaroElement): TaroTextStyleType {
  const _st = node._st._st

  const attributes: TaroAny = {
    maxLines: _st.maxLines || Infinity,
    // 已做处理的属性
    letterSpacing: _st.letterSpacing,
    textAlign: _st.textAlign,
    textOverflow: _st.textOverflow
  }

  return attributes
}

export function getNormalAttributes (node: TaroElement): TaroStyleType {
  const _st = node._st._st

  const _nid = node._nid
  const _attrs: StandardProps = node._attrs || {}

  const transform: TaroAny = _st.transform
  const transformRotate: HarmonyType.Transform.Rotate = transform?.rotate?.[0]
  const transformTranslate: HarmonyType.Transform.Translate = transform?.translate?.[0]
  const transformScale: HarmonyType.Transform.Scale = transform?.scale?.[0]
  const transformTransform: HarmonyType.Transform.Transform = transform?.transform?.[0]

  let normalAttributes: HarmonyStyle = {
    // Flex相关
    flexBasis: _st.flexBasis,
    flexGrow: _st.flexGrow,
    flexShrink: _st.flexShrink,
    alignSelf: _st.alignSelf,
    // 尺寸相关
    width: _st.width,
    height: _st.height,
    constraintSize: _st.constraintSize,
    margin: _st.margin,
    padding: _st.padding,
    // 边框相关
    borderStyle: _st.borderStyle,
    borderWidth: _st.borderWidth,
    borderColor: _st.borderColor,
    borderRadius: _st.borderRadius,
    // 背景相关
    backgroundColor: _st.backgroundColor,
    backgroundImage: _st.backgroundImage,
    backgroundImageSize: _st.backgroundImageSize,
    backgroundRepeat: _st.backgroundRepeat,
    linearGradient: _st.linearGradient,
    // 变换相关
    rotate: transformRotate,
    translate: transformTranslate,
    scale: transformScale,
    transform: transformTransform,
    // 通用文本相关
    color: _st.color,
    fontSize: _st.fontSize,
    fontStyle: _st.fontStyle,
    fontWeight: _st.fontWeight,
    fontFamily: _st.fontFamily || TEXT_DEFAULT_STYLE.FONT_FAMILY,
    lineHeight: _st.lineHeight,
    decoration: _st.decoration,
    // 其他
    clip: _st.clip,
    id: _attrs.id || _nid,
    // focus: _attrs.focus || false,
  }


  const id = node._nid
  const component: TaroAny = node._instance

  // taro_page 等写死在运行时里的节点，没有 _instance
  if (component) {
    const overwriteStyle: TaroStyleType = component.nodeInfoMap[id].overwriteStyle

    // 处理覆盖属性：如动画的覆盖
    if (overwriteStyle) {
      normalAttributes = ObjectAssign(normalAttributes, overwriteStyle)
    }
  }
  return normalAttributes
}
