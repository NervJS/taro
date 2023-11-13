import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, shouldBindEvent, getNormalAttributes } from './utils/helper'

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

function getAttributes (node: TaroViewElement, overwriteStyle: Record<string, any>) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node, overwriteStyle),
    color: _attrs.color || '#04BE02',
  }
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroSwitch {
  nodeInfoMap: any = {}

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @State value: boolean = false

  thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    bindInstanceToNode(this.node, this)

    this.nodeInfoMap[this.node._nid] = {}
    this.nodeInfoMap[this.node._nid].eventMap = {}
    this.nodeInfoMap[this.node._nid].promiseMap = {}
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
        .attrs(getAttributes(this.node, this.overwriteStyle))
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
