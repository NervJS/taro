import { w3cToHarmonyStyle } from './dynamicConvert'
import { AttributeManager } from './AttributeManager'
import { TEXT_DEFAULT_STYLE } from './constant/style'

import type { TaroElement } from '@tarojs/runtime'

export function getFontAttributes (node: TaroElement) {
  const { _st } = node

  return {
    maxLines: +AttributeManager.getNodeStyle(_st, 'WebkitLineClamp', Infinity),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
    // 已做处理的属性
    lineHeight: AttributeManager.getStyleAfterConvert(_st, 'lineHeight'),
    letterSpacing: AttributeManager.getStyleAfterConvert(_st, 'letterSpacing'),
    textAlign: AttributeManager.getStyleAfterConvert(_st, 'textAlign', TEXT_DEFAULT_STYLE.TEXT_ALIGN),
    textOverflow:  AttributeManager.getStyleAfterConvert(_st, 'textOverflow', TEXT_DEFAULT_STYLE.TEXT_OVERFLOW),
    fontWeight: AttributeManager.getStyleAfterConvert(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    decoration: AttributeManager.getStyleAfterConvert(_st, 'textDecoration'),
    fontColor: AttributeManager.getStyleAfterConvert(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getStyleAfterConvert(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
  }
}

export function getNormalAttributes (node: TaroElement) {
  const { _nid, _st, _attrs } = node

  const linearGradient = AttributeManager.getStyleAfterConvert(_st, 'linearGradient')

  const background = AttributeManager.getStyleAfterConvert(_st, 'background')
  const _backgroundImage = background?.image?.[0]
  let backgroundImage, backgroundRepeat
  if (_backgroundImage) {
    backgroundImage = _backgroundImage.src
    backgroundRepeat = _backgroundImage.repeat
  }
  const backgroundSize = background?.size?.[0]
  const backgroundColor = backgroundImage ? null : background?.color

  const transform = AttributeManager.getStyleAfterConvert(_st, 'transform')
  const transformRotate = transform?.rotate?.[0]
  const transformTranslate = transform?.translate?.[0]
  const transformScale = transform?.scale?.[0]
  const transformTransform = transform?.transform?.[0]

  const normalAttributes = {
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
    // 其他
    id: AttributeManager.getNodeStyle(_attrs, 'id', _nid),
    // animation: AttributeManager.getNodeAnimationData(_st),
    focus: AttributeManager.getNodeStyle(_attrs, 'focus', false),
    clip: AttributeManager.getNodeStyle(_st, 'overflow') === 'hidden',
  }

  transformW3CToHarmonyInStyle(_st, normalAttributes)

  const id = node._nid
  const component = node._instance
  const overwriteStyle = component.nodeInfoMap[id].overwriteStyle
  
  // 处理覆盖属性：如动画的覆盖
  if (overwriteStyle) {
    Object.assign(normalAttributes, overwriteStyle)
  }
  return normalAttributes
}

// TODO: 需要遍历一遍，存在性能问题
// 处理style属性，运行时转换成鸿蒙样式
export const transformW3CToHarmonyInStyle = (styles: any, stylesAfterConvert: any) => {
  if (!styles) return

  Object.keys(styles).forEach((key) => {
    if (key.startsWith('_')) return 

    w3cToHarmonyStyle(stylesAfterConvert, key, styles[key])
  })
}
