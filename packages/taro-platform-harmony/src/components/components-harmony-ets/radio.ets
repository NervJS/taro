import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroElement,
  TaroAny,
  TaroEvent,
  createTaroEvent
} from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { shouldBindEvent, getNormalAttributes, getNodeThresholds, bindAnimation } from './utils/helper'

import type { TaroRadioGroupElement, TaroRadioElement } from './element'
import type { TaroStyleType, HarmonyType } from '@tarojs/runtime'

interface RadioOptions {
  group: string
  value: string
}
interface RadioAttrs {
  radioStyle?: HarmonyType.RadioStyle
  themeStyles?: boolean
}

@Extend(Radio)
function style (style: TaroStyleType) {
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

@Extend(Radio)
function radioAttr (attr: RadioAttrs) {
  .radioStyle(attr.radioStyle)
  .themeStyles(attr.themeStyles)
}

function getAttributes (node: TaroRadioElement): RadioAttrs {
  const radioAttrs: RadioAttrs = {}
  radioAttrs.radioStyle = {
    checkedBackgroundColor: node._attrs.color || '#1aad19'
  }
  radioAttrs.themeStyles = !!node._attrs.disabled
  return radioAttrs
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export struct TaroRadio {
  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroRadioElement

  @State checked: boolean = false

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
          Radio({
            group: this.node.group || this.node.parentNode?._nid || '',
            value: this.node._attrs.value || '',
          })
            .checked(this.checked)
            .defaultEvent()
            .style(getNormalAttributes(this.node))
            .radioAttr(getAttributes(this.node))
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
function radioGroupAttrs (style: TaroStyleType) {
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


@Component
export struct TaroRadioGroup {
  nodeInfoMap: TaroAny = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroRadioGroupElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
    const childList = this.node.getElementsByTagName<TaroRadioElement>('RADIO')
    childList.forEach(element => {
      element.group = this.node._attrs.name || this.node._nid
    })
    // 阻止事件冒泡传递上去
    this.node.addEventListener('change', (e: TaroEvent) => e.stopPropagation())
  }

  // Element使用的获取器
  getValue (): string | undefined {
    const childList = this.node.getElementsByTagName<TaroRadioElement>('RADIO')
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].checked) {
        return childList[i]._attrs.value
      }
    }
    return undefined
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
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
      .radioGroupAttrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
