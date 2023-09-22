import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { bindInstanceToNode, getNormalAttributes, parseStyles } from './utils/helper'
import { TEXT_DEFAULT_STYLE, INPUT_TYPE_MAP, INPUT_CONFIRM_MAP } from './utils/constant/style'

import type { TaroViewElement } from '../runtime'

@Extend(TextInput)
function attrs ({
  flexSize,
  alignSelf,
  size,
  focus,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundImageSize,
}) {
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .alignSelf(alignSelf)
  .size(size)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .defaultFocus(focus)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

@Extend(TextInput)
function textAttrs ({
  fontColor,
  fontSize,
  fontWeight,
  fontFamily
}) {
  .fontColor(fontColor)
  .fontSize(fontSize)
  .fontWeight(fontWeight)
  .fontFamily(fontFamily)
}


function getFontAttributes (node: TaroElement) {
  const { _st } = node

  return {
    fontColor: AttributeManager.getNodeStyle(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getNodeStyle(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
    fontWeight: AttributeManager.getNodeStyle(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
  }
}

@Component
struct TaroInput {
  info: Area = null

  @State text: string = ''

  @ObjectLink node: TaroViewElement

  controller: TextInputController = new TextInputController()

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    
    this.text = this.node._attrs.value || ''
  }

  getPlaceholderColor (node) {
    const { placeholderTextColor, placeholderStyle } = node._attrs

    return placeholderTextColor || parseStyles(placeholderStyle)?.color
  }

  getInputType (node) {
    if (node._attrs?.password) return InputType.Password

    return INPUT_TYPE_MAP[node._attrs?.type] || InputType.Normal
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      TextInput({ text: this.text, placeholder: this.node._attrs?.placeholder || '', controller: this.controller })
        .type(this.getInputType(this.node))
        .maxLength(Number(this.node._attrs?.maxlength) || null)
        .placeholderColor(this.getPlaceholderColor(this.node))
        .enterKeyType(INPUT_CONFIRM_MAP[this.node._attrs?.confirmType] || EnterKeyType.Done)
        .defaultEvent()
        .attrs(getNormalAttributes(this.node))
        .textAttrs(getFontAttributes(this.node))
        .onChange((value: string) => {
          const event = createTaroEvent('input', { detail: { value } }, this.node)
          eventHandler(event, 'input', this.node)
        })
    }
  }
}

export default TaroInput
