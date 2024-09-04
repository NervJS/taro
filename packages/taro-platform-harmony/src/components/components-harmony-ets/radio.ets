import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { HarmonyType, TaroAny, TaroEvent, TaroRadioElement, TaroRadioGroupElement } from '@tarojs/runtime'

interface RadioAttrs {
  radioStyle?: HarmonyType.RadioStyle
  themeStyles?: boolean
  disabled?: boolean
}

@Extend(Radio)
function radioAttr (attr: RadioAttrs) {
  .radioStyle(attr.radioStyle)
  .themeStyles(attr.themeStyles || false)
  .enabled(!attr.disabled)
}

function getAttributes (node: TaroRadioElement): RadioAttrs {
  const radioAttrs: RadioAttrs = {}
  radioAttrs.radioStyle = {
    checkedBackgroundColor: node._attrs.color || '#1aad19'
  }
  radioAttrs.themeStyles = !!node._attrs.disabled
  radioAttrs.disabled = !!node._attrs.disabled
  return radioAttrs
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export struct TaroRadio {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroRadioElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroRadioElement
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
        Radio({
          group: this.node.group || this.node.parentNode?._nid.toString() || '',
          value: this.node.value || '',
        })
          .checked(this.node.checked)
          .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
          .radioAttr(getAttributes(this.node))
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
          .opacity(!!this.node?._attrs.disabled ? 0.4 : 1)
      }
      .onClick(() => {
        if (this.node) {
          if (!this.node._checked && !this.node?._attrs.disabled) {
            this.node.checked = !this.node.checked
          }
        }
      })
    }
  }
}


@Component
export struct TaroRadioGroup {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroRadioGroupElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroRadioGroupElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    if (this.node) {
      this.node._instance = this
      const childList = this.node.getElementsByTagName<TaroRadioElement>('RADIO')
      childList.forEach(element => {
        element.group = this.node?._attrs.name || this.node?._nid.toString()
      })
      // 阻止事件冒泡传递上去
      this.node.addEventListener('change', (e: TaroEvent) => e.stopPropagation())
    }
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
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
