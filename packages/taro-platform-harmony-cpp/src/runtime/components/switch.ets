import { AREA_CHANGE_EVENT_NAME, createTaroEvent, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroSwitchElement, TaroEvent } from '@tarojs/runtime'

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
      .attrs(getAttributes(this.node))
      .margin(0)
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
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        if (this.node) {
          this.node._nodeInfo.areaInfo = res[1]
        }
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
