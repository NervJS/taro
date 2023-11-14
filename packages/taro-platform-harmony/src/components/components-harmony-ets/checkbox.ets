import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { shouldBindEvent, getNormalAttributes } from './utils/helper'

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

function getAttributes (node: TaroViewElement, overwriteStyle: Record<string, any>) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node, overwriteStyle),
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

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @State checked: boolean = false

  thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
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
            .attrs(getAttributes(this.node, this.overwriteStyle))
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

@Extend(CheckboxGroup)
function attrs ({
  id,
  color,
}) {
  .id(id)
  .key(id)
  .selectedColor(color)
}

function getAttributesGroup (node: TaroViewElement, overwriteStyle: Record<string, any>) {
  const { _attrs = {} } = node
  return {
    ...getNormalAttributes(node, overwriteStyle),
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

  @State isAreaChangeTap: boolean = false

  thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
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
      CheckboxGroup({
        group: '',
      })
        .onChange(({ name, status }) => {
        })
        .defaultEvent()
        .attrs(getAttributesGroup(this.node, this.overwriteStyle))
        .themeStyles(!!this.node._attrs.disabled)
        .visibleChangeEvent()
    }
  }
}

export { TaroCheckbox, TaroCheckboxGroup }
