import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { FlexManager } from './utils/FlexManager'
import { bindAnimation, bindInstanceToNode, shouldBindEvent, getNodeAreaChange, getNodeVisibleChange, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Radio)
function attrs ({
  color,
}) {
  .radioStyle({
    checkedBackgroundColor: color,
  })
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    color: _attrs.color || '#1aad19',
  }
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroRadio {
  info: Area = null

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false

  @State checked: boolean = false

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    this.checked = !!this.node._attrs.checked
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Row() {
        Radio({
          group: this.node._attrs.name || AttributeManager.getNodeStyle(this.node.parentNode._attrs, 'id', this.node.parentNode._nid),
          value: this.node._attrs.value,
        })
          .checked(this.checked)
          .defaultEvent()
          .attrs(getAttributes(this.node))
          .themeStyles(!!this.node._attrs.disabled)
          .onChange((value: boolean) => {
            if (!!this.node._attrs.disabled) {
              // FIXME 找下文档是否有强制刷新方法
              this.checked = !this.checked
              this.checked = !this.checked
            } else {
              this.checked = value
              if (this.checked) {
                const event = createTaroEvent('change', { detail: { value: this.node._attrs.value } }, this.node)
                eventHandler(event, 'change', this.node)
              }
            }
          })
          .visibleChangeEvent()
        Text(this.node.textContent)
          .textAlign(TextAlign.Center)
          .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
      }
    }
  }
}

@Extend(Flex)
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

@Component
struct TaroRadioGroup {
  info: Area = null

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }
  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
      .attrs(getNormalAttributes(this.node, this.overwriteStyle))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}

export { TaroRadio, TaroRadioGroup }
