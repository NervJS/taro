import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createNode } from './render'
import { createTaroEvent } from './utils/events'
import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'
import { shouldBindEvent, getNormalAttributes, getNodeThresholds } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Checkbox)
function attrs ({
  id,
  color,
}) {
  .id(id)
  .key(id)
  .selectedColor(color)
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node),
    color: _attrs.color || '#1aad19',
    name: _attrs.name || _attrs.value || node.textContent,
    group: _attrs.name || AttributeManager.getNodeStyle(node.parentNode._attrs, 'id', node.parentNode._nid),
  }
}

@Extend(Checkbox)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroCheckbox {
  nodeInfoMap: any = {}

  @ObjectLink node: TaroViewElement

  @State checked: boolean = false

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)

    this.checked = !!this.node._attrs.checked
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Stack() {
        Row() {
          Checkbox(getAttributes(this.node))
            .defaultEvent()
            .attrs(getAttributes(this.node))
            .themeStyles(!!this.node._attrs.disabled)
            .select(this.checked)
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
          this.checked = !this.checked
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

function getAttributesGroup (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node),
    color: _attrs.color || '#1aad19',
  }
}

@Extend(CheckboxGroup)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroCheckboxGroup {
  nodeInfoMap: any = {}

  @ObjectLink node: TaroViewElement

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)

    // 阻止事件冒泡传递上去
    this.node.addEventListener('change', (e) => {
      e.stopPropagation()
      e.detail.value = this.getValues()
    })
  }

  // Element使用的获取值方法
  getValues () {
    const childList = this.node.getElementsByTagName('CHECKBOX')
    const result = []
    childList.forEach(element => {
      if (element._instance.checked) {
        result.push(element._attrs.value)
      }
    })
    return result
  }

  // Element使用的重置方法
  reset () {
    this.node.getElementsByTagName('CHECKBOX').forEach(element => {
      element._instance.checked = element._attrs.checked
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
      .attrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}

export { TaroCheckbox, TaroCheckboxGroup }
