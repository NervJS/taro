import type { TaroElement, TaroStyleType } from '@tarojs/runtime'
import { isUndefined } from '../shared'
import { getNormalAttributes } from './utils/helper'

function getTop (node: TaroElement): Length | number {
  return node?.hmStyle?.top || 0
}

function getLeft (node: TaroElement): Length | number {
  return node?.hmStyle?.left || 0
}

class CommonStyleModify implements AttributeModifier<CommonAttribute> {
  node: TaroElement | null = null
  style: TaroStyleType | null = null

  setNode (node: TaroElement) {
    this.node = node
    this.style = getNormalAttributes(this.node)

    return this
  }

  applyNormalAttribute(instance: CommonAttribute): void {
    if (this.node && this.style) {

      if (!isUndefined(this.style.id)) {
        instance.id(this.style.id)
        instance.key(this.style.id)
      }
      if (!isUndefined(this.style.flexGrow)) {
        instance.flexGrow(this.style.flexGrow)
      }
      if (!isUndefined(this.style.flexShrink)) {
        instance.flexShrink(this.style.flexShrink)
      }
      if (!isUndefined(this.style.flexBasis)) {
        instance.flexBasis(this.style.flexBasis)
      }
      if (!isUndefined(this.style.alignSelf)) {
        instance.alignSelf(this.style.alignSelf)
      }
      if (!isUndefined(this.style.paddingTop) || !isUndefined(this.style.paddingRight) || !isUndefined(this.style.paddingBottom) || !isUndefined(this.style.paddingLeft)) {
        instance.padding({
          top: this.style.paddingTop,
          right: this.style.paddingRight,
          bottom: this.style.paddingBottom,
          left: this.style.paddingLeft
        })
      }
      if (!isUndefined(this.style.marginTop) || !isUndefined(this.style.marginRight) || !isUndefined(this.style.marginBottom) || !isUndefined(this.style.marginLeft)) {
        instance.margin({
          top: this.style.marginTop,
          right: this.style.marginRight,
          bottom: this.style.marginBottom,
          left: this.style.marginLeft
        })
      }
      if (!isUndefined(this.style.width)) {
        instance.width(this.style.width)
      }
      if (!isUndefined(this.style.height)) {
        instance.height(this.style.height)
      }
      if (!isUndefined(this.style.minWidth) || !isUndefined(this.style.maxWidth) || !isUndefined(this.style.minHeight) || !isUndefined(this.style.maxHeight)) {
        instance.constraintSize({
          minWidth: this.style.minWidth,
          maxWidth: this.style.maxWidth,
          minHeight: this.style.minHeight,
          maxHeight: this.style.maxHeight
        })
      }
      if (!isUndefined(this.style.backgroundColor)) {
        instance.backgroundColor(this.style.backgroundColor)
      }
      if (!isUndefined(this.style.backgroundImage)) {
        instance.backgroundImage(this.style.backgroundImage?.src, this.style.backgroundRepeat)
      }
      if (!isUndefined(this.style.backgroundSize)) {
        instance.backgroundImageSize(this.style.backgroundSize)
      }
      if (!isUndefined(this.style.backgroundPosition)) {
        instance.backgroundImagePosition(this.style.backgroundPosition)
      }
      if (!isUndefined(this.style.borderTopStyle) || !isUndefined(this.style.borderRightStyle) || !isUndefined(this.style.borderBottomStyle) || !isUndefined(this.style.borderLeftStyle)) {
        instance.borderStyle({
          top: this.style.borderTopStyle,
          right: this.style.borderRightStyle,
          bottom: this.style.borderBottomStyle,
          left: this.style.borderLeftStyle
        })
      }
      if (!isUndefined(this.style.borderTopWidth) || !isUndefined(this.style.borderRightWidth) || !isUndefined(this.style.borderBottomWidth) || !isUndefined(this.style.borderLeftWidth)) {
        instance.borderWidth({
          top: this.style.borderTopWidth,
          right: this.style.borderRightWidth,
          bottom: this.style.borderBottomWidth,
          left: this.style.borderLeftWidth
        })
      }
      if (!isUndefined(this.style.borderTopColor) || !isUndefined(this.style.borderRightColor) || !isUndefined(this.style.borderBottomColor) || !isUndefined(this.style.borderLeftColor)) {
        instance.borderColor({
          top: this.style.borderTopColor,
          right: this.style.borderRightColor,
          bottom: this.style.borderBottomColor,
          left: this.style.borderLeftColor
        })
      }
      if (!isUndefined(this.style.borderTopLeftRadius) || !isUndefined(this.style.borderTopRightRadius) || !isUndefined(this.style.borderBottomLeftRadius) || !isUndefined(this.style.borderBottomRightRadius)) {
        instance.borderRadius({
          topLeft: this.style.borderTopLeftRadius,
          topRight: this.style.borderTopRightRadius,
          bottomLeft: this.style.borderBottomLeftRadius,
          bottomRight: this.style.borderBottomRightRadius
        })
      }
      if (!isUndefined(this.style.zIndex)) {
        instance.zIndex(this.style.zIndex)
      }
      if (!isUndefined(this.style.opacity)) {
        instance.opacity(this.style.opacity)
      }
      if (!isUndefined(this.style.linearGradient)) {
        instance.linearGradient(this.style.linearGradient)
      }
      if (!isUndefined(this.style.overflow)) {
        instance.clip(this.style.overflow)
      }
      if (!isUndefined(this.style.transformOrigin)) {
        instance.rotate({ centerX: this.style.transformOrigin.x, centerY: this.style.transformOrigin.y, angle: 0 })
        instance.scale({ centerX: this.style.transformOrigin.x, centerY: this.style.transformOrigin.y })
      }
      if (!isUndefined(this.style.transform)) {
        instance.transform(this.style.transform)
      }
      if (this.node.hmStyle?.position === 'absolute' || this.node.hmStyle?.position === 'fixed') {
        instance.position({
          x: getLeft(this.node),
          y: getTop(this.node)
        })
      }
      if (this.node.hmStyle?.position === 'relative') {
        instance.offset({
          x: getLeft(this.node),
          y: getTop(this.node)
        })
      }
    }
  }
}

const modify = new CommonStyleModify()

export default modify
