import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, shouldBindEvent, getNodeAreaChange, getNodeVisibleChange } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Toggle)
function attrs ({
 color,
}) {
  .selectedColor(color)
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    color: _attrs.color || '#04BE02',
  }
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroSwitch {
  info: Area = null

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false
  
  @State value: boolean = false

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    this.value = !!this.node._attrs.checked
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Toggle({
        type: this.node._attrs.type !== 'checkbox' ? ToggleType.Switch : ToggleType.Checkbox,
        isOn: this.value,
      })
        .defaultEvent()
        .attrs(getAttributes(this.node))
        .themeStyles(!!this.node._attrs.disabled)
        .onChange((isOn: boolean) => {
          if (!this.node._attrs.disabled) {
            this.value = isOn
            const event = createTaroEvent('change', { detail: { value: this.value } }, this.node)
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

export default TaroSwitch
