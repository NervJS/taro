import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Toggle)
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
    color: _attrs.color || '#04BE02',
  }
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export default struct TaroSwitch {
  nodeInfoMap: any = {}

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
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
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
