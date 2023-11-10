import window from '@ohos.window'
import { isNumber, isUndefined } from '@tarojs/shared'
import { eventHandler, Current, getComponentEventCallback, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, parseStyles, shouldBindEvent, bindFocus, getNodeVisibleChange } from './utils/helper'
import { TEXT_DEFAULT_STYLE } from './utils/constant/style'

import type { TaroViewElement } from '../runtime'

@Extend(TextArea)
function attrs ({
  id,
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
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
  .key(id)
  .constraintSize(constraintSize)
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
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
}

@Extend(TextArea)
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
    fontColor: AttributeManager.getStyleAfterConvert(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getStyleAfterConvert(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
    fontWeight: AttributeManager.getNodeStyle(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
  }
}

@Component
struct TaroTextArea {
  nodeInfoMap: any = {}

  @State text: string = ''

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false
  
  @State overwriteStyle: Record<string, any> = {}

  controller: TextAreaController = new TextAreaController()

  windowClass: Window = null

  height: number = 0
  
  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  aboutToAppear () {
    bindFocus(this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })

    this.nodeInfoMap[this.node._nid] = {}
    this.nodeInfoMap[this.node._nid].eventMap = {}
    this.nodeInfoMap[this.node._nid].promiseMap = {}
    this.text = this.node._attrs.value || ''

    try {
      (Current as any).contextPromise
        .then(context => {
          return window.getTopWindow(context)
        }).then(windowClass => {
          this.windowClass = windowClass
          windowClass.on('keyboardHeightChange', (height) => {
            if (isNumber(height)) {
              if (this.height !== height) {
                this.onKeyboardHeightChange(height)
                this.height = height
              }
            }
          })
        }).catch((err)=>{
          console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
        })
    } catch (exception) {
      console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(exception))
    }
  }

  aboutToDisappear () {
    if (this.windowClass) {
      this.windowClass.then(win => {
        win.off('keyboardheightchange')
      })
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
    .onAreaChange(getComponentEventCallback(AREA_CHANGE_EVENT_NAME, this, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      TextArea({ text: this.getText(), placeholder: this.node._attrs?.placeholder || '', controller: this.controller })
        .focusable(true)  
        .key(this.node._nid)
        .placeholderColor(this.getPlaceholderColor(this.node))
        .defaultEvent()
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .textAttrs(getFontAttributes(this.node))
        .onChange((value: string) => {
          const event = createTaroEvent('input', { detail: { value } }, this.node)
          eventHandler(event, 'input', this.node)
          this.text = value
        })
        .visibleChangeEvent()
    }
  }
}

export default TaroTextArea
