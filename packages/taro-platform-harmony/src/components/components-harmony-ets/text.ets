import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, NodeType } from '@tarojs/runtime'

import { getButtonColor } from './button'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { getNodeThresholds, getNormalAttributes, getFontAttributes, shouldBindEvent } from './utils/helper'

import type { TaroButtonElement, TaroElement, TaroTextElement, TaroAny, TaroTextStyleType, TaroStyleType } from '@tarojs/runtime'

@Extend(Text)
function textNormalStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

@Extend(Text)
function textNormalFontStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .opacity(style.opacity)
  .fontColor(style.color)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
  .lineHeight(style.lineHeight)
  .decoration({
    type: style.textDecoration,
    color: style.color
  })
}

@Extend(Text)
function textSpecialFontStyle(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .textOverflow(attr.textOverflow)
  .maxLines(attr.WebkitLineClamp)
  .letterSpacing(attr.letterSpacing)
}

function getButtonFontSize (node: TaroButtonElement) {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
}

@Builder
export default function TaroText (node: TaroTextElement) {
  if (node.nodeType === NodeType.TEXT_NODE && node.parentNode) {
    if ((node.parentNode as TaroElement).tagName === 'BUTTON') {
      Text(node.textContent)
        .textNormalFontStyle(getNormalAttributes(node.parentNode as TaroElement))
        .textSpecialFontStyle(getFontAttributes(node.parentNode as TaroElement))
        .fontSize((node.parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((node.parentNode as TaroButtonElement)))
        .fontColor((node.parentNode as TaroButtonElement).hmStyle.color || getButtonColor(node.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((node.parentNode as TaroButtonElement)._attrs.type).text))
    } else {
      Text(node.textContent)
        .textNormalFontStyle(getNormalAttributes(node.parentNode as TaroElement))
        .textSpecialFontStyle(getFontAttributes(node.parentNode as TaroElement))
    }
  } else {
    Text(node.textContent)
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .textNormalStyle(getNormalAttributes(node))
    .textNormalFontStyle(getNormalAttributes(node))
    .textSpecialFontStyle(getFontAttributes(node))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
