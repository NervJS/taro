import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { AttributeManager } from './utils/AttributeManager'
import { bindInstanceToNode, shouldBindEvent, getNodeAreaChange, getNodeVisibleChange } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Checkbox)
function attrs ({
  color,
}) {
  .selectedColor(color)
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
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
      Row() {
        Checkbox(getAttributes(this.node))
          .defaultEvent()
          .attrs(getAttributes(this.node))
          .themeStyles(!!this.node._attrs.disabled)
          .select(this.value)
          .onChange((value: boolean) => {
            if (!!this.node._attrs.disabled) {
              // FIXME 找下文档是否有强制刷新方法
              this.value = !this.value
              this.value = !this.value
            } else {
              this.value = value
              const event = createTaroEvent('change', { detail: { value: this.value } }, this.node)
              eventHandler(event, 'change', this.node)
            }
          })
          .visibleChangeEvent()
        Text(this.node.textContent)
          .textAlign(TextAlign.Center)
          .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
      }
    }
  }
}

@Extend(CheckboxGroup)
function attrs ({
  color,
}) {
  .selectedColor(color)
}

function getAttributesGroup (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    color: _attrs.color || '#1aad19',
  }
}

@Extend(CheckboxGroup)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroCheckboxGroup {
  info: Area = null

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      CheckboxGroup({
        group: '',
      })
        .onChange(({ name, status }) => {
        })
        .defaultEvent()
        .attrs(getAttributesGroup(this.node))
        .themeStyles(!!this.node._attrs.disabled)
        .visibleChangeEvent()
    }
  }
}

export { TaroCheckbox, TaroCheckboxGroup }
