import { bindInstanceToNode, bindAnimation, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent
} from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { AttributeManager } from './utils/AttributeManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroButtonElement, TaroElement } from './element'
import type { TaroStyleType } from './type'
import type { TaroAny } from './utils/type'

@Extend(Button)
function attrs (style: TaroStyleType) {
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


@Extend(Button)
function themeStyles(style: TaroStyleType) {
  .border({
    width: 1,
    color: style.backgroundColor
  })
  .fontColor(style.color)
  .opacity(style.opacity)
  .backgroundColor(style.backgroundColor)
}

function getThemeAttributes (node: TaroButtonElement): TaroStyleType {
  const _st = node._st
  const _attrs = node._attrs
  const isPlain: boolean = _attrs.plain
  const isDisabled: boolean = _attrs.disabled
  const type: string = _attrs.type || 'default'

  return {
    opacity: isDisabled ? 0.4 : 1,
    backgroundColor: isPlain ? Color.Transparent : (AttributeManager.getNodeStyle(_st, 'backgroundColor') || BUTTON_THEME_COLOR.get(type).background),
    color: AttributeManager.getStyleAfterConvert(_st, 'color', BUTTON_THEME_COLOR.get(type).text),
  }
}

@Component
export default struct TaroButton {
  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroButtonElement

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Button({ stateEffect: !this.node._attrs.disabled }) {
        Row() {
          if (this.node._attrs.loading) {
            LoadingProgress()
            .width(20).height(20)
            .color(getThemeAttributes(this.node).color)
          }
          ForEach(this.node.childNodes, (item: TaroElement) => {
            createNode(item)
          }, (item: TaroElement) => item._nid)
        }
      }
      .attrs(getNormalAttributes(this.node))
      .themeStyles(getThemeAttributes(this.node))
      .onClick((e: ClickEvent) => {
        if (['submit', 'reset'].includes(this.node._attrs.formType)) {
          const eventName = this.node._attrs.formType + '-btn'
          const event: TaroEvent = createTaroEvent(eventName, {}, this.node)
          eventHandler(event, eventName, this.node)
        }
        eventHandler(e, 'click', this.node)
      })
      .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
      }))
      .visibleChangeEvent()
    }
  }
}
