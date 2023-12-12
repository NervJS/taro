import window from '@ohos.window'
import common from '@ohos.app.ability.common'
import { isNumber, isUndefined } from '@tarojs/shared'
import { bindFocus, bindInstanceToNode, eventHandler, Current, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent, TaroAny, createTaroEvent } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { getNormalAttributes, parseStyles, shouldBindEvent, getNodeThresholds, bindAnimation } from './utils/helper'
import { TEXT_DEFAULT_STYLE, INPUT_TYPE_MAP, INPUT_CONFIRM_MAP } from './utils/constant/style'

import type { TaroInputElement } from './element'
import type { TaroStyleType } from './type'

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
    textAlign: AttributeManager.getStyleAfterConvert(node._st, 'textAlign', TEXT_DEFAULT_STYLE.TEXT_ALIGN),
  }
}

@Component
struct TaroInput {
  nodeInfoMap: TaroAny = {}

  @State text: string = ''

  @ObjectLink node: TaroInputElement

  controller: TextInputController = new TextInputController()

  windowClass?: window.Window

  _height: number = 0

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  heightChange = (height: number) => {
    if (isNumber(height)) {
      if (this._height !== height) {
        this.onKeyboardHeightChange(height)
        this._height = height
      }
    }
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    bindFocus(this.node)
    // 绑定动画
    bindAnimation(this.node)

    this.text = this.node._attrs.value || ''

    try {
      Current.contextPromise
        .then((context: common.BaseContext) => {
          return window.getLastWindow(context, (err, windowClass: window.Window) => {
            const errCode: number = err.code;
            if (errCode) {
              console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
              return;
            }
            this.windowClass = windowClass
            windowClass.on('keyboardHeightChange', this.heightChange)
          })
        })
    } catch (exception) {
      console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(exception))
    }
  }

  aboutToDisappear () {
    if (this.windowClass) {
      try {
        this.windowClass.off('keyboardHeightChange', this.heightChange)
      } catch (err) {
        console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
      }
    }
  }

  onKeyboardHeightChange (height: number) {
    const event: TaroEvent = createTaroEvent('keyboardHeightChange', { detail: { height: height, duration: 0 } }, this.node)
    eventHandler(event, 'keyboardHeightChange', this.node)
  }

  getPlaceholderColor (node: TaroInputElement): string {
    const placeholderTextColor: string = node._attrs.placeholderTextColor || ''
    const placeholderStyle: string = node._attrs.placeholderStyle || ''

    return placeholderTextColor || parseStyles(placeholderStyle)?.color
  }

  getInputType (node: TaroInputElement) {
    if (node._attrs?.password) return InputType.Password
    return INPUT_TYPE_MAP.get(node._attrs?.type || '') || InputType.Normal
  }

  getText (): string {
    return isUndefined(this.node._attrs.value) ? this.text : this.node._attrs.value
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onBlur(() => {
      const event: TaroEvent = createTaroEvent('blur', { detail: { value: this.text } }, this.node)
      eventHandler(event, 'blur', this.node)
    })
    .onFocus(() => {
      const event: TaroEvent = createTaroEvent('focus', { detail: { value: this.text, height: this._height } }, this.node)
      eventHandler(event, 'focus', this.node)
    })
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      TextInput({ text: this.getText(), placeholder: this.node._attrs?.placeholder || '', controller: this.controller })
        .focusable(true)
        .key(this.node._nid)
        .type(this.getInputType(this.node))
        .maxLength(Number(this.node._attrs?.maxlength) || null)
        .placeholderColor(this.getPlaceholderColor(this.node))
        .enterKeyType(INPUT_CONFIRM_MAP.get(this.node._attrs?.confirmType) || EnterKeyType.Done)
        .defaultEvent()
        .styles(getNormalAttributes(this.node))
        .attrs(getAttributes(this.node))
        .style(TextInputStyle.Inline)
        .onChange((value: string) => {
          const event: TaroEvent = createTaroEvent('input', { detail: { value } }, this.node)
          eventHandler(event, 'input', this.node)
          this.text = value
        })
        .onSubmit(() => {
          const event: TaroEvent = createTaroEvent('confirm', { detail: { value: this.text } }, this.node)
          eventHandler(event, 'confirm', this.node)
        })
        .visibleChangeEvent()
    }
  }
}

export default TaroInput
