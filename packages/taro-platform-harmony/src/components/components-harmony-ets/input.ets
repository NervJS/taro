import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TEXT_DEFAULT_STYLE, INPUT_TYPE_MAP } from './utils/constant/style'
import { bindInstanceToNode, getNormalAttributes, parseStyles } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(TextInput)
function attrs ({
  flexSize,
  alignSelf,
  size,
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
  }

  getPlaceholderColor (node) {
    const { placeholderTextColor, placeholderStyle } = node._attrs

    return placeholderTextColor || parseStyles(placeholderStyle)?.color
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
        .type(INPUT_TYPE_MAP[this.node._attrs?.type] || InputType.Normal)
        .defaultEvent()
        .attrs(getNormalAttributes(this.node))
        .textAttrs(getFontAttributes(this.node))
        .placeholderColor(this.getPlaceholderColor(this.node))
        .maxLength(Number(this.node._attrs?.maxlength))
    }
  }
}

export default TaroInput
