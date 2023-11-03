import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
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
    disabled: !!_attrs.disabled,
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
      Checkbox({
        name: '',
        group: '',
      })
        .defaultEvent()
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
    }
  }
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
        .visibleChangeEvent()
    }
  }
}

export { TaroCheckbox, TaroCheckboxGroup }
