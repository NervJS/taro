import { createTaroEvent, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { createLazyChildren } from './render'
import { FlexManager } from './utils/FlexManager'
import { shouldBindEvent, getNormalAttributes, getNodeThresholds } from './utils/helper'

import type { TaroStyleType, TaroAny, TaroEvent, TaroCheckboxElement, TaroCheckboxGroupElement } from '@tarojs/runtime'

interface CheckboxOptions {
  name?: string
  group?: string
}
interface CheckboxAttrs {
  selectedColor?: ResourceColor
}

@Extend(Checkbox)
function checkboxStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

@Extend(Checkbox)
function checkboxAttr(attr: CheckboxAttrs) {
  .selectedColor(attr.selectedColor)
}

function getAttributes (node: TaroCheckboxElement): CheckboxAttrs {
  const _attrs = node._attrs
  const checkboxAttrs: CheckboxAttrs = {}
  checkboxAttrs.selectedColor = _attrs.color || '#1aad19'
  return checkboxAttrs
}

function getOptions (node: TaroCheckboxElement): CheckboxOptions {
  return {
    name: node.value as string || node.textContent
  }
}

@Component
export struct TaroCheckbox {
  node: TaroCheckboxElement | null = null

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
          Checkbox(getOptions(this.node))
            .checkboxStyle(getNormalAttributes(this.node))
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
            .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
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
}

@Extend(Flex)
function checkboxGroupAttrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

interface ChangeEventDetail { value: string[] }

@Component
export struct TaroCheckboxGroup {
  node: TaroCheckboxGroupElement | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    if (this.node) {
      // 阻止事件冒泡传递上去
      this.node.addEventListener('change', (e: TaroEvent<ChangeEventDetail>) => {
        e.stopPropagation()
        e.detail.value = (this.node as TaroCheckboxGroupElement).value
      })
    }
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      if (this.node) {
        this.node._nodeInfo.areaInfo = res[1]
      }
    }))
  }

  build() {
    if (this.node) {
      Flex(FlexManager.flexOptions(this.node)) {
        createLazyChildren(this.node)
      }
      .checkboxGroupAttrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
