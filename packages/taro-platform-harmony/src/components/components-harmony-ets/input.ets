import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, TaroEvent, createTaroEvent } from '@tarojs/runtime'

import { getNormalAttributes, parseStyles, shouldBindEvent, getNodeThresholds } from './utils/helper'
import { INPUT_TYPE_MAP, INPUT_CONFIRM_MAP } from './utils/constant/style'

import type { TaroStyleType, TaroAny, TaroInputElement } from '@tarojs/runtime'

interface InputAttrs {
  textAlign?: TextAlign
}

@Extend(TextInput)
function styles (style: TaroStyleType) {
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

@Extend(TextInput)
function attrs(attr: InputAttrs) {
  .textAlign(attr.textAlign)
}


function getAttributes(node: TaroInputElement): InputAttrs {
  return {
    textAlign: node.hmStyle.textAlign,
  }
}

function getPlaceholderColor (node: TaroInputElement): string {
  const placeholderTextColor: string = node._attrs.placeholderTextColor || ''
  const placeholderStyle: string = node._attrs.placeholderStyle || ''

  return placeholderTextColor || parseStyles(placeholderStyle)?.color
}

function getInputType (node: TaroInputElement) {
  if (node._attrs?.password) return InputType.Password

  return INPUT_TYPE_MAP.get(node._attrs?.type || '') || InputType.Normal
}

@Builder
export default function TaroInput(node: TaroInputElement) {
  TextInput({ text: node.value, placeholder: node._attrs?.placeholder || '', controller: node.controller })
    .focusable(true)
    .key(node._nid)
    .type(getInputType(node))
    .maxLength(Number(node._attrs?.maxlength) || null)
    .placeholderColor(getPlaceholderColor(node))
    .enterKeyType(INPUT_CONFIRM_MAP.get(node._attrs?.confirmType) || EnterKeyType.Done)
    .styles(getNormalAttributes(node))
    .attrs(getAttributes(node))
    .style(TextInputStyle.Inline)
    .onChange((value: string) => {
      const event: TaroEvent = createTaroEvent('input', { detail: { value } }, node)
      eventHandler(event, 'input', node)

      node.value = value
    })
    .onSubmit(() => {
      const event: TaroEvent = createTaroEvent('confirm', { detail: { value: node.value } }, node)
      eventHandler(event, 'confirm', node)
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
      node._nodeInfo.areaInfo = res
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
