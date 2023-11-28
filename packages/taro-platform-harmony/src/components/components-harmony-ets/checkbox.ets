import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, TaroNode, TaroEvent } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createNode } from './render'
import { createTaroEvent } from './utils/events'
import { FlexManager } from './utils/FlexManager'
import { AttributeManager } from './utils/AttributeManager'
import { shouldBindEvent, getNormalAttributes, getNodeThresholds } from './utils/helper'

import type { TaroCheckboxGroupElement, TaroElement, TaroViewElement } from './utils/element'
import type { CompType, TaroStyleType } from './type'
import type { TaroAny } from './utils/type'


@Extend(Checkbox)
function checkboxStyle (style: TaroStyleType) {
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
}

@Extend(Checkbox)
function checkboxAttr(attr: CompType.Checkbox.Attrs) {
  .selectedColor(attr.selectedColor)
}

function getAttributes (node: TaroViewElement | TaroCheckboxGroupElement): CompType.Checkbox.Attrs {
  const _attrs = node._attrs
  const checkboxAttrs: CompType.Checkbox.Attrs = {}
  checkboxAttrs.selectedColor = _attrs.color || '#1aad19'
  return checkboxAttrs
}

function getOptions (node: TaroViewElement): CompType.Checkbox.Options {
  const _attrs = node._attrs || {}
  const name: string = _attrs.name
  const value: string = _attrs.value
  return {
    name: name || value || node.textContent,
    group: name || node.parentNode ? AttributeManager.getNodeStyle(node.parentElement._attrs, 'id', node.parentNode._nid) : '',
  }
}


@Component
export struct TaroCheckbox {
  nodeInfoMap: TaroAny = {}

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
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Stack() {
        Row() {
          Checkbox(getOptions(this.node))
            .defaultEvent()
            .checkboxStyle(getNormalAttributes(this.node))
            .checkboxAttr(getAttributes(this.node))
            .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
            .select(this.checked)
            .onChange((value: boolean) => {
              if (!!this.node._attrs.disabled) {
                // FIXME 找下文档是否有强制刷新方法
                this.checked = !this.checked
                this.checked = !this.checked
              } else {
                this.checked = value
                if (this.checked) {
                  const event: TaroEvent = createTaroEvent('change', { detail: { value: this.node._attrs.value } }, this.node)
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
function checkboxGroupAttrs (style: TaroStyleType) {
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
}

interface ChangeEventDetail { value: string[] }

@Component
export struct TaroCheckboxGroup {
  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroCheckboxGroupElement

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)

    // 阻止事件冒泡传递上去
    this.node.addEventListener('change', (e: TaroEvent<ChangeEventDetail>) => {
      e.stopPropagation()
      e.detail.value = this.getValues()
    })
  }

  // Element使用的获取值方法
  getValues () {
    const childList = this.node.getElementsByTagName('CHECKBOX')
    const result: string[] = []
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
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, (item: TaroElement) => {
          createNode(item)
        }, (item: TaroElement) => item._nid)
      }
      .checkboxGroupAttrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
