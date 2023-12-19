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
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
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

@Builder
export function TaroCheckbox(node: TaroCheckboxElement) {
  Stack() {
    Row() {
      Checkbox(getOptions(node))
        .checkboxStyle(getNormalAttributes(node))
        .checkboxAttr(getAttributes(node))
        .opacity(!!node._attrs.disabled ? 0.4 : 1)
        .select(node.checked)
        .onChange((value: boolean) => {
          if (!!node?._attrs.disabled) {
            node.updateComponent()
          } else {
            node.updateCheckedValue(value)

            if (value) {
              const event: TaroEvent = createTaroEvent('change', { detail: { value: node?._attrs.value } }, node)
              eventHandler(event, 'change', node)
            }
          }
        })
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
        .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
      Text(node.textContent)
        .textAlign(TextAlign.Center)
        .opacity(!!node._attrs.disabled ? 0.4 : 1)
    }
    .alignItems(VerticalAlign.Start)
    .onClick(() => {
      if (!node?._attrs.disabled) {
        node.checked = !node.checked
      }
    })
  }
}

@Extend(Flex)
function checkboxGroupAttrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
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
