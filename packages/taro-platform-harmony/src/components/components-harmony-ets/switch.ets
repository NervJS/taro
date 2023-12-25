import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroAny, TaroStyleType, TaroSwitchElement, TaroEvent } from '@tarojs/runtime'

interface SwitchAttrs {
  selectedColor?: ResourceColor
}

@Extend(Toggle)
function styles (style: TaroStyleType) {
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

@Extend(Toggle)
function attrs(attr: SwitchAttrs) {
  .selectedColor(attr.selectedColor)
}

function getAttributes (node: TaroSwitchElement): SwitchAttrs {
  const _attrs = node._attrs
  const switchStyle: SwitchAttrs = {}
  switchStyle.selectedColor = _attrs.color || '#04BE02'
  return switchStyle
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export default struct TaroSwitch {
  node: TaroSwitchElement | null = null

  aboutToAppear () {
    if (this.node && !this.node._isInit) {
      this.node._isInit = true
      this.node._reset = this.node.checked || false
    }
  }

  build () {
    if (this.node) {
      Toggle({
        type: this.node._attrs.type !== 'checkbox' ? ToggleType.Switch : ToggleType.Checkbox,
        isOn: this.node.checked,
      })
        .styles(getNormalAttributes(this.node))
        .attrs(getAttributes(this.node))
        .themeStyles(!!this.node._attrs.disabled)
        .onChange((isOn: boolean) => {
          if (this.node) {
            if (!this.node?._attrs.disabled) {
              const event: TaroEvent = createTaroEvent('change', { detail: { value: isOn } }, this.node)
      
              this.node.updateCheckedValue(isOn)
              eventHandler(event, 'change', this.node)
            } else {
              this.node.updateComponent()
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
    }
  }
}
