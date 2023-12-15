import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, getNormalAttributes, getFontAttributes, shouldBindEvent, parseStyles } from './utils/helper'

import type { TaroAny, TaroStyleType, TaroTextStyleType, TaroTextAreaElement, TaroEvent } from '@tarojs/runtime'

@Extend(TextArea)
function textStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
  .fontColor(style.color)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
}

@Extend(TextArea)
function textAttr(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .maxLines(attr.maxLines)
}

function getPlaceholderColor (node: TaroTextAreaElement): string {
  const placeholderStyle: string = node._attrs.placeholderStyle || ''

  return parseStyles(placeholderStyle)?.color
}

@Builder
export default function TaroTextArea (node: TaroTextAreaElement) {
  TextArea({ text: node.value, placeholder: node._attrs?.placeholder || '', controller: node.controller })
    .focusable(true)
    .key(node._nid)
    .placeholderColor(getPlaceholderColor(node))
    .textStyle(getNormalAttributes(node))
    .textAttr(getFontAttributes(node))
    .onChange((value: string) => {
      const event: TaroEvent = createTaroEvent('input', { detail: { value } }, node)
      eventHandler(event, 'input', node)
      node._text = value
    })
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onBlur(() => {
      const event: TaroEvent = createTaroEvent('blur', { detail: { value: node.value } }, node)
      eventHandler(event, 'blur', node)
    })
    .onFocus(() => {
      const event: TaroEvent = createTaroEvent('focus', { detail: { value: node.value, height: node._height } }, node)

      eventHandler(event, 'focus', node)
    })
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
