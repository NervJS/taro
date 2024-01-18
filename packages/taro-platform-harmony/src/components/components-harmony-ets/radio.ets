import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { createLazyChildren } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import { TaroEvent, TaroAny, HarmonyType, TaroRadioGroupElement, TaroRadioElement } from '@tarojs/runtime'

interface RadioAttrs {
  radioStyle?: HarmonyType.RadioStyle
  themeStyles?: boolean
}

@Extend(Radio)
function radioAttr (attr: RadioAttrs) {
  .radioStyle(attr.radioStyle)
  .themeStyles(attr.themeStyles)
}

function getAttributes (node: TaroRadioElement): RadioAttrs {
  const radioAttrs: RadioAttrs = {}
  radioAttrs.radioStyle = {
    checkedBackgroundColor: node._attrs.color || '#1aad19'
  }
  radioAttrs.themeStyles = !!node._attrs.disabled
  return radioAttrs
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export struct TaroRadio {
  node: TaroRadioElement | null = null
  
  aboutToAppear () {
    if (this.node && !this.node._isInit) {
      this.node._isInit = true
      this.node._reset = this.node.checked || false
    }
  }

  build () {
    if (this.node) {
      Stack() {
        Row() {
          Radio({
            group: this.node.group || this.node.parentNode?._nid || '',
            value: this.node.value || '',
          })
            .checked(this.node.checked)
            .attributeModifier(commonStyleModify.setNode(this.node))
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
            .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
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
}


@Component
export struct TaroRadioGroup {
  node: TaroRadioGroupElement | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    if (this.node) {
      const childList = this.node.getElementsByTagName<TaroRadioElement>('RADIO')
      childList.forEach(element => {
        element.group = this.node?._attrs.name || this.node?._nid
      })
      // 阻止事件冒泡传递上去
      this.node.addEventListener('change', (e: TaroEvent) => e.stopPropagation())
    }
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      if (this.node) {
        this.node._nodeInfo.areaInfo = res[1]
      }
    }))
  }

  build() {
    if (this.node) {
      if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
        Row() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .defaultEvent()
        .visibleChangeEvent()
        .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      } else {
        Column() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .defaultEvent()
        .visibleChangeEvent()
        .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      }
    }
  }
}
