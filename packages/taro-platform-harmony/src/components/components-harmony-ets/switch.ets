import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroEvent, TaroSwitchElement } from '@tarojs/runtime'

interface SwitchAttrs {
  selectedColor?: ResourceColor
  disabled?: boolean
}

@Extend(Toggle)
function attrs(attr: SwitchAttrs) {
  .selectedColor(attr.selectedColor)
  .enabled(!attr.disabled)
}

function getAttributes (node: TaroSwitchElement): SwitchAttrs {
  const attr: SwitchAttrs = {}
  attr.selectedColor = node._attrs.color || '#04BE02'
  attr.disabled = !!node._attrs.disabled
  return attr
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export default struct TaroSwitch {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroSwitchElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroSwitchElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear () {
    if (this.node && !this.node._isInit) {
      this.node._isInit = true
      this.node._instance = this
      this.node._reset = this.node.checked || false
    }
  }

  build () {
    Toggle({
      type: this.node._attrs.type !== 'checkbox' ? ToggleType.Switch : ToggleType.Checkbox,
      isOn: this.node.checked,
    })
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .attrs(getAttributes(this.node))
      .themeStyles(!!this.node._attrs.disabled)
      .onChange((isOn: boolean) => {
        if (this.node) {
          if (!this.node?._attrs.disabled) {
            const event: TaroEvent = createTaroEvent('change', { detail: { value: isOn } }, this.node)

            this.node.updateCheckedValue(isOn)
            eventHandler(event, 'change', this.node)
          } else {
            this.node.updateComponent()
          }
        }
      })
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        if (this.node) {
          this.node._nodeInfo.areaInfo = res[1]
        }
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
