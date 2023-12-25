import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, getNormalAttributes, getFontAttributes, shouldBindEvent, parseStyles } from './utils/helper'

import type { TaroAny, TaroStyleType, TaroTextStyleType, TaroTextAreaElement, TaroEvent } from '@tarojs/runtime'

@Extend(TextArea)
function textStyle (style: TaroStyleType) {
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
  .fontColor(style.color)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
}

@Extend(TextArea)
function textAttr(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .maxLines(attr.WebkitLineClamp)
}

function getPlaceholderColor (node: TaroTextAreaElement): string {
  const placeholderStyle: string = node._attrs.placeholderStyle || ''

  return parseStyles(placeholderStyle)?.color
}

@Component
export default struct TaroTextArea {
  @State value: string = ''

  node: TaroTextAreaElement | null = null

  aboutToAppear () {
    if (this.node) {
      this.value = this.node.value
      this.node._instance = this

      if (!this.node._isInit) {
        this.node._isInit = true
        this.node._reset = this.node.value || ''
      }
    }
  }

  build () {
    if (this.node) {
      TextArea({ text: this.value, placeholder: this.node._attrs?.placeholder || '', controller: this.node.controller })
        .key(this.node._nid)
        .maxLength(Number(this.node._attrs?.maxlength) || null)
        .placeholderColor(getPlaceholderColor(this.node))
        .textStyle(getNormalAttributes(this.node))
        .textAttr(getFontAttributes(this.node))
        .onChange((value: string) => {
          const event: TaroEvent = createTaroEvent('input', { detail: { value } }, this.node)
          
          this.value = value
          this.node?.updateFormWidgetValue(value)
          eventHandler(event, 'input', this.node)
        })
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onBlur(() => {
          const event: TaroEvent = createTaroEvent('blur', { detail: { value: this.value } }, this.node)
          eventHandler(event, 'blur', this.node)
        })
        .onFocus(() => {
          const event: TaroEvent = createTaroEvent('focus', { detail: { value: this.value, height: this.node?._height } }, this.node)
    
          eventHandler(event, 'focus', this.node)
        })
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          if (this.node) {
            this.node._nodeInfo.areaInfo = res[1]
          }
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}
