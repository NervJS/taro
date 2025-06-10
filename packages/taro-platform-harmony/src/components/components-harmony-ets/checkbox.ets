import { createTaroEvent, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroCheckboxElement, TaroCheckboxGroupElement, TaroEvent } from '@tarojs/runtime'

interface CheckboxOptions {
  name?: string
  group?: string
}
interface CheckboxAttrs {
  selectedColor?: ResourceColor
  disabled?: boolean
}

@Extend(Checkbox)
function checkboxAttr(attr: CheckboxAttrs) {
  .selectedColor(attr.selectedColor)
  .enabled(!attr.disabled)
}

function getAttributes (node: TaroCheckboxElement): CheckboxAttrs {
  const _attrs = node._attrs
  const checkboxAttrs: CheckboxAttrs = {}
  checkboxAttrs.selectedColor = _attrs.color || '#1aad19'
  checkboxAttrs.disabled = !!_attrs.disabled
  return checkboxAttrs
}

function getOptions (node: TaroCheckboxElement): CheckboxOptions {
  return {
    name: node.value as string || node.textContent
  }
}


@Component
export struct TaroCheckbox {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroCheckboxElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroCheckboxElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear () {
    if (this.node && !this.node._isInit) {
      this.node._isInit = true
      this.node._instance = this
      this.node._reset = this.node.checked || false
    }
  }

  build () {
    Stack() {
      Row() {
        Checkbox(getOptions(this.node))
          .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
          .checkboxAttr(getAttributes(this.node))
          .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
          .select(this.node.checked)
          .onChange((value: boolean) => {
            if (this.node) {
              if (!!this.node?._attrs.disabled) {
                this.node.updateComponent()
              } else {
                this.node.updateCheckedValue(value)

                if (value) {
                  const event: TaroEvent = createTaroEvent('change', { detail: { value: this.node?._attrs.value } }, this.node)
                  eventHandler(event, 'change', this.node)
                }
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
        Text(this.node.textContent)
          .textAlign(TextAlign.Center)
          .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
      }
      .onClick(() => {
        if (this.node) {
          if (!this.node?._attrs.disabled) {
            this.node.checked = !this.node.checked
          }
        }
      })
    }
  }
}

interface ChangeEventDetail { value: string[] }

@Component
export struct TaroCheckboxGroup {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroCheckboxGroupElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroCheckboxGroupElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    if (this.node) {
      this.node._instance = this
      // 阻止事件冒泡传递上去
      this.node.addEventListener('change', (e: TaroEvent<ChangeEventDetail>) => {
        e.stopPropagation()
        e.detail.value = (this.node as TaroCheckboxGroupElement).value
      })
    }
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      if (this.node) {
        this.node._nodeInfo.areaInfo = res[1]
      }
    }))
  }

  build() {
    if (FlexManager.useFlexLayout(this.node)) {
      Flex(FlexManager.flexOptions(this.node)) {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .defaultEvent()
      .visibleChangeEvent()
    } else if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
      Row() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .defaultEvent()
      .visibleChangeEvent()
    } else {
      Column() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
