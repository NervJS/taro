import window from '@ohos.window'
import { isNumber, isUndefined } from '@tarojs/shared'
import { eventHandler, Current } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, parseStyles, shouldBindEvent, getNodeAreaChange, bindFocus, getNodeVisibleChange } from './utils/helper'
import { TEXT_DEFAULT_STYLE, INPUT_TYPE_MAP, INPUT_CONFIRM_MAP } from './utils/constant/style'

import type { TaroViewElement } from '../runtime'

@Extend(TextInput)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}

@Extend(TextInput)
function textAttrs ({
  fontColor,
  fontSize,
  fontWeight,
  fontFamily,
  textAlign
}) {
  .fontColor(fontColor)
  .fontSize(fontSize)
  .fontWeight(fontWeight)
  .fontFamily(fontFamily)
  .textAlign(textAlign)
}


function getFontAttributes (node: TaroElement) {
  const { _st } = node

  return {
    fontColor: AttributeManager.getStyleAfterConvert(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getStyleAfterConvert(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
    fontWeight: AttributeManager.getNodeStyle(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
    textAlign: AttributeManager.getTextAlign(_st)
  }
}

@Component
struct TaroInput {
  info: Area = null

  @State text: string = ''

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false
  
  @State overwriteStyle: Record<string, any> = {}

  controller: TextInputController = new TextInputController()

  windowClass: Window = null

  height: number = 0

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  heightChange = (height) => {
    if (isNumber(height)) {
      if (this.height !== height) {
        this.onKeyboardHeightChange(height)
        this.height = height
      }
    }
  }

  aboutToAppear () {
    bindFocus(this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })

    this.text = this.node._attrs.value || ''

    try {
      (Current as any).contextPromise
        .then(context => {
          return window.getTopWindow(context)
        }).then(windowClass => {
          this.windowClass = windowClass
          windowClass.on('keyboardHeightChange', this.heightChange)
        }).catch((err)=>{
          console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
        })
    } catch (exception) {
      console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(exception))
    }
  }

  aboutToDisappear () {
    if (this.windowClass) {
      try {
        this.windowClass.off('keyboardheightchange', this.heightChange)
      } catch (err) {
        console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
      }
    }
  }

  onKeyboardHeightChange (height) {
    const event = createTaroEvent('keyboardheightchange', { detail: { height: height, duration: 0 } }, this.node)
    eventHandler(event, 'keyboardheightchange', this.node)
  }

  getPlaceholderColor (node) {
    const { placeholderTextColor, placeholderStyle } = node._attrs

    return placeholderTextColor || parseStyles(placeholderStyle)?.color
  }

  getInputType (node) {
    if (node._attrs?.password) return InputType.Password

    return INPUT_TYPE_MAP[node._attrs?.type] || InputType.Normal
  }

  getText () {
    return isUndefined(this.node._attrs.value) ? this.text : this.node._attrs.value
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onBlur(() => {
      const event = createTaroEvent('blur', { detail: { value: this.value } }, this.node)
      eventHandler(event, 'blur', this.node)
    })
    .onFocus(() => {
      const event = createTaroEvent('focus', { detail: { value: this.value, height: this.height } }, this.node)
      eventHandler(event, 'focus', this.node)
    })
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      TextInput({ text: this.getText(), placeholder: this.node._attrs?.placeholder || '', controller: this.controller })
        .focusable(true)  
        .key(this.node._nid)
        .type(this.getInputType(this.node))
        .maxLength(Number(this.node._attrs?.maxlength) || null)
        .placeholderColor(this.getPlaceholderColor(this.node))
        .enterKeyType(INPUT_CONFIRM_MAP[this.node._attrs?.confirmType] || EnterKeyType.Done)
        .defaultEvent()
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .style(TextInputStyle.Inline)
        .textAttrs(getFontAttributes(this.node))
        .onChange((value: string) => {
          const event = createTaroEvent('input', { detail: { value } }, this.node)
          eventHandler(event, 'input', this.node)
          this.text = value
        })
        .onSubmit(() => {
          const event = createTaroEvent('confirm', { detail: { value } }, this.node)
          eventHandler(event, 'confirm', this.node)
        })
        .visibleChangeEvent()
    }
  }
}

export default TaroInput
