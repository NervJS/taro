import { ObjectAssign } from '@tarojs/runtime'

import { w3cToHarmonyStyle } from './dynamicConvert'
import { AttributeManager } from './AttributeManager'
import { TEXT_DEFAULT_STYLE } from './constant/style'

import type { TaroAny, TaroElement } from '@tarojs/runtime'
import type { TaroStyleType, CompType, HarmonyType, HarmonyStyle } from '../type'

export function getFontAttributes (node: TaroElement): CompType.Text.Attrs {
  const _st = node._st

  return {
    maxLines: Number(AttributeManager.getNodeStyle(_st, 'WebkitLineClamp')) || Infinity,
    // 已做处理的属性
    letterSpacing: AttributeManager.getStyleAfterConvert(_st, 'letterSpacing'),
    textAlign: AttributeManager.getStyleAfterConvert(_st, 'textAlign', TEXT_DEFAULT_STYLE.TEXT_ALIGN),
    textOverflow:  AttributeManager.getStyleAfterConvert(_st, 'textOverflow', TEXT_DEFAULT_STYLE.TEXT_OVERFLOW),
  }
}

export function getNormalAttributes (node: TaroElement): TaroStyleType {
  const _st = node._st
  const _nid = node._nid
  const _attrs = node._attrs

  const linearGradient: HarmonyType.LinearGradient[] = AttributeManager.getStyleAfterConvert(_st, 'linearGradient')

  const background: TaroAny = AttributeManager.getStyleAfterConvert(_st, 'background')
  const _backgroundImage: HarmonyType.Background.backgroundImage = background?.image?.[0]
  let backgroundImage: ResourceStr | undefined
  let backgroundRepeat: ImageRepeat | undefined
  if (_backgroundImage) {
    backgroundImage = _backgroundImage.src
    if (_backgroundImage.repeat) {
      backgroundRepeat = _backgroundImage.repeat
    }
  }
  const backgroundSize: HarmonyType.Background.backgroundImageSize = background?.size?.[0]
  const backgroundColor: ResourceColor = backgroundImage ? null : background?.color

  const transform: TaroAny = AttributeManager.getStyleAfterConvert(_st, 'transform')
  const transformRotate: HarmonyType.Transform.Rotate = transform?.rotate?.[0]
  const transformTranslate: HarmonyType.Transform.Translate = transform?.translate?.[0]
  const transformScale: HarmonyType.Transform.Scale = transform?.scale?.[0]
  const transformTransform: HarmonyType.Transform.Transform = transform?.transform?.[0]

  let normalAttributes: HarmonyStyle = {
    // Flex相关
    flexBasis: AttributeManager.getStyleAfterConvert(_st, 'flexBasis'),
    flexGrow: AttributeManager.getStyleAfterConvert(_st, 'flexGrow'),
    flexShrink: AttributeManager.getStyleAfterConvert(_st, 'flexShrink'),
    alignSelf: AttributeManager.getStyleAfterConvert(_st, 'alignSelf'),
    // 尺寸相关
    width: AttributeManager.getStyleAfterConvert(_st, 'width'),
    height: AttributeManager.getStyleAfterConvert(_st, 'height'),
    constraintSize: AttributeManager.getStyleAfterConvert(_st, 'constraintSize'),
    margin: AttributeManager.getStyleAfterConvert(_st, 'margin'),
    padding: AttributeManager.getStyleAfterConvert(_st, 'padding'),
    // 边框相关
    borderStyle: AttributeManager.getStyleAfterConvert(_st, 'borderStyle'),
    borderWidth: AttributeManager.getStyleAfterConvert(_st, 'borderWidth'),
    borderColor: AttributeManager.getStyleAfterConvert(_st, 'borderColor'),
    borderRadius: AttributeManager.getStyleAfterConvert(_st, 'borderRadius'),
    // 背景相关
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage,
    backgroundImageSize: backgroundSize,
    backgroundRepeat: backgroundRepeat,
    linearGradient: linearGradient?.[0],
    // 变换相关
    rotate: transformRotate,
    translate: transformTranslate,
    scale: transformScale,
    transform: transformTransform,
    // 通用文本相关
    color: AttributeManager.getStyleAfterConvert(_st, 'color'),
    fontSize: AttributeManager.getStyleAfterConvert(_st, 'fontSize'),
    fontStyle: AttributeManager.getStyleAfterConvert(_st, 'fontStyle'),
    fontWeight: AttributeManager.getStyleAfterConvert(_st, 'fontWeight'),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
    lineHeight: AttributeManager.getStyleAfterConvert(_st, 'lineHeight'),
    decoration: AttributeManager.getStyleAfterConvert(_st, 'decoration'),
    // 其他
    clip: AttributeManager.getNodeStyle(_st, 'overflow') === 'hidden',
    id: AttributeManager.getNodeStyle(_attrs, 'id', _nid),
    focus: AttributeManager.getNodeStyle(_attrs, 'focus', false),
  }

  transformW3CToHarmonyInStyle(_st, normalAttributes)

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

// TODO: 需要遍历一遍，存在性能问题
// 处理style属性，运行时转换成鸿蒙样式
export const transformW3CToHarmonyInStyle = (styles: TaroAny, stylesAfterConvert: HarmonyStyle) => {
  if (!styles) return

  Object.keys(styles).forEach((key) => {
    if (key.startsWith('_')) return
    w3cToHarmonyStyle(stylesAfterConvert, key, styles[key])
  })
}
