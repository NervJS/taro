import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroAny, TaroEvent } from '@tarojs/runtime'
import type { TaroViewElement, TaroElement } from './element'
import type { TaroStyleType, CompType } from './type'

@Extend(Toggle)
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
}

@Extend(Toggle)
function attrs(attr: CompType.Switch.Attrs) {
  .selectedColor(attr.selectedColor)
}

function getAttributes (node: TaroViewElement): CompType.Switch.Attrs {
  const _attrs = node._attrs
  const switchStyle: CompType.Switch.Attrs = {}
  switchStyle.selectedColor = _attrs.color || '#04BE02'
  return switchStyle
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export default struct TaroSwitch {
  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroViewElement

  @State value: boolean = false

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)

    this.value = !!this.node._attrs.checked
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
      Toggle({
        type: this.node._attrs.type !== 'checkbox' ? ToggleType.Switch : ToggleType.Checkbox,
        isOn: this.value,
      })
        .defaultEvent()
        .styles(getNormalAttributes(this.node))
        .attrs(getAttributes(this.node))
        .themeStyles(!!this.node._attrs.disabled)
        .onChange((isOn: boolean) => {
          if (!this.node._attrs.disabled) {
            this.value = isOn
            const event: TaroEvent = createTaroEvent('change', { detail: { value: this.value } }, this.node)
            eventHandler(event, 'change', this.node)
          } else {
            // FIXME 找下文档是否有强制刷新方法
            this.value = !this.value
            this.value = !this.value
          }
        })
        .visibleChangeEvent()
    }
  }
}
