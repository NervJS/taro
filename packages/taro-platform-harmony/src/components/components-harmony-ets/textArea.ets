import window from '@ohos.window'
import common from '@ohos.app.ability.common'
import { isNumber, isUndefined } from '@tarojs/shared'
import { bindFocus, bindInstanceToNode, bindAnimation, eventHandler, Current, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { getNodeThresholds, getNormalAttributes, getFontAttributes, parseStyles, shouldBindEvent } from './utils/helper'
import { TEXT_DEFAULT_STYLE } from './utils/constant/style'

import type { TaroViewElement, TaroInputElement, TaroElement } from './utils/element'
import type { TaroStyleType, CompType } from './type'
import type { TaroAny } from './utils/type'

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
  .fontColor(style.fontColor)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
}

@Extend(TextArea)
function textAttr(attr: CompType.Text.Attrs) {
  .textAlign(attr.textAlign)
  .maxLines(attr.maxLines)
}

@Component
struct TaroTextArea {
  nodeInfoMap: TaroAny = {}

  @State text: string = ''

  @ObjectLink node: TaroViewElement

  controller: TextAreaController = new TextAreaController()

  windowClass?: window.Window

  _height: number = 0

  heightChange = (height: number) => {
    if (isNumber(height)) {
      if (this._height !== height) {
        this.onKeyboardHeightChange(height)
        this._height = height
      }
    }
  }

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
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
    const event: TaroEvent = createTaroEvent('keyboardHeightChange', { detail: { height, duration: 0 } }, this.node)
    eventHandler(event, 'keyboardHeightChange', this.node)
  }

  getPlaceholderColor (node: TaroViewElement): string {
    const placeholderTextColor: string = node._attrs.placeholderTextColor
    const placeholderStyle: string = node._attrs.placeholderStyle

    return placeholderTextColor || parseStyles(placeholderStyle)?.color
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
      TextArea({ text: this.getText(), placeholder: this.node._attrs?.placeholder || '', controller: this.controller })
        .focusable(true)  
        .key(this.node._nid)
        .placeholderColor(this.getPlaceholderColor(this.node))
        .defaultEvent()
        .textStyle(getNormalAttributes(this.node))
        .textAttr(getFontAttributes(this.node))
        .onChange((value: string) => {
          const event: TaroEvent = createTaroEvent('input', { detail: { value } }, this.node)
          eventHandler(event, 'input', this.node)
          this.text = value
        })
        .visibleChangeEvent()
    }
  }
}

export default TaroTextArea
