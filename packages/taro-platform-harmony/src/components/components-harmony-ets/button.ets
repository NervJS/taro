import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent, getNodeAreaChange } from './utils/helper'

import type { TaroButtonElement } from '../runtime'

@Extend(Button)
function attrs ({
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
  transform
 }) {
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
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

@Extend(Button)
function themeStyles({
 isPlain,
 fontColor,
 isDisabled,
 backgroundColor,
}) {
  .border({
    width: 1,
    color: backgroundColor
  })
  .fontColor(fontColor)
  .opacity(isDisabled ? 0.4 : 1)
  .backgroundColor(isPlain ? Color.Transparent : backgroundColor)
}

function getThemeAttributes (node: TaroButtonElement) {
  const { _st, _attrs } = node
  const isPlain = _attrs.plain
  const isDisabled = _attrs.disabled
  const type = _attrs.type || 'default'

  return {
    isPlain,
    isDisabled,
    backgroundColor: AttributeManager.getNodeStyle(_st, 'backgroundColor') || BUTTON_THEME_COLOR[type].background,
    fontColor: AttributeManager.getNodeStyle(_st, 'color', BUTTON_THEME_COLOR[type].text),
  }
}

@Component
struct TaroButton {
  info: Area = null

  @ObjectLink node: TaroButtonElement

  @State isAreaChangeTap: boolean = false
  
  @State overwriteStyle: Record<string, any> = {}

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Button({ stateEffect: !this.node._attrs.disabled }) {
        Row() {
          if (this.node._attrs.loading) {
            LoadingProgress()
            .width(20).height(20)
            .color(getThemeAttributes(this.node).fontColor)
          }
          ForEach(this.node.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
      }
      .attrs(getNormalAttributes(this.node, this.overwriteStyle))
      .themeStyles(getThemeAttributes(this.node))
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
      .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
      .onAreaChange(getNodeAreaChange((areaResult: Area) => {
        this.info = areaResult
      }, this))
    }
  }
}

export default TaroButton
