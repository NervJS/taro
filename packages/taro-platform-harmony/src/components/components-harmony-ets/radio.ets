import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { FlexManager } from './utils/FlexManager'
import { bindAnimation, bindInstanceToNode, shouldBindEvent, getComponentEventCallback, getNormalAttributes, getNodeVisibleChange, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Radio)
function attrs ({
  id,
  color,
}) {
  .id(id)
  .key(id)
  .radioStyle({
    checkedBackgroundColor: color,
  })
}

function getAttributes (node: TaroViewElement, overwriteStyle: Record<string, any>) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node, overwriteStyle),
    color: _attrs.color || '#1aad19',
  }
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroRadio {
  nodeInfoMap: any = {}

  eventMap: any = {}

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @State checked: boolean = false

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  aboutToAppear () {
    bindInstanceToNode(this.node, this)

    this.nodeInfoMap[this.node._nid] = {}
    this.checked = !!this.node._attrs.checked
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Stack() {
        Row() {
          Radio({
            group: this.node._attrs.name || AttributeManager.getNodeStyle(this.node.parentNode._attrs, 'id', this.node.parentNode._nid),
            value: this.node._attrs.value,
          })
            .checked(this.checked)
            .defaultEvent()
            .attrs(getAttributes(this.node, this.overwriteStyle))
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
        .onClick(() => {
          if (!this.checked) {
            this.checked = !this.checked
          }
        })
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
  .key(id)
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
  nodeInfoMap: any = {}

  eventMap: any = {}

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
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
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
