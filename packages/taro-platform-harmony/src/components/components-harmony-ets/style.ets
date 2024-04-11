import type { TaroAny, HarmonyStyle, TaroElement, TaroStyleType, TaroTextElement }  from '@tarojs/runtime'
import { isUndefined } from '@tarojs/shared'
import { computeBackgroundPosition } from './utils'
import { getNormalAttributes } from './utils/helper'
import { isMaxWidthView } from './utils/styles'
import { FlexManager } from './utils/flexManager.ets'

class TextStyleModify implements AttributeModifier<TextAttribute> {
  initStyle?: TaroStyleType
  node: TaroTextElement | null = null
  style: HarmonyStyle | null = null
  overwriteStyle: Record<string, TaroAny> = {}
  withNormal: boolean = false

  setNode (node: TaroTextElement, initStyle?: HarmonyStyle) {
    this.node = node
    this.withNormal = false
    this.overwriteStyle = {}
    this.style = getNormalAttributes(this.node)
    this.initStyle = initStyle
    // 覆盖初始化样式
    if (initStyle) {
      Object.keys(initStyle).forEach(key => {
        if (this.style && !this.style[key]) {
          this.style[key] = initStyle[key]
        }
      })
    }
    return this
  }

  withNormalStyle () {
    this.withNormal = true
    return this
  }

  setAnimationStyle (overwriteStyle: Record<string, TaroAny>) {
    this.overwriteStyle = overwriteStyle
    return this
  }

  applyNormalAttribute(instance: TextAttribute): void {
    if (this.node && this.style) {
      if (this.withNormal) {
        setNormalAttributeIntoInstance(instance, this.style, this.node)
      }
      setNormalTextAttributeIntoInstance(instance, this.style, this.node)
      setSpecialTextAttributeIntoInstance(instance, this.style, this.node)
    }

    setAnimationAttributeIntoInstance(instance, this.overwriteStyle, this.style || {})
  }
}

class CommonStyleModify implements AttributeModifier<CommonAttribute> {
  initStyle?: TaroStyleType
  node: TaroElement | null = null
  style: TaroStyleType | null = null
  overwriteStyle: TaroStyleType = {}

  setNode (node: TaroElement, initStyle?: TaroStyleType) {
    this.node = node
    this.style = getNormalAttributes(this.node)
    this.initStyle = initStyle
    this.overwriteStyle = {}
    // 覆盖初始化样式
    if (initStyle) {
      Object.keys(initStyle).forEach(key => {
        if (this.style && !this.style[key]) {
          this.style[key] = initStyle[key]
        }
      })
    }
    return this
  }
  
  setAnimationStyle (overwriteStyle: Record<string, TaroAny>) {
    this.overwriteStyle = overwriteStyle
    if (this.style && this.overwriteStyle) {
      Object.keys(this.overwriteStyle).forEach(key => {
        this.style![key] = this.overwriteStyle[key]
      })
    }
    return this
  }

  applyNormalAttribute(instance: CommonAttribute): void {
    if (this.node && this.style) {
      setNormalAttributeIntoInstance(instance, this.style, this.node)
    }

    setAnimationAttributeIntoInstance(instance, this.overwriteStyle, this.style || {})
  }
}

class PseudoStyleModify implements AttributeModifier<CommonAttribute> {
  style: TaroStyleType | null = null

  setStyle (style: HarmonyStyle) {
    this.style = style
    return this
  }

  applyNormalAttribute(instance: CommonAttribute): void {
    if (this.style) {
      setNormalAttributeIntoInstance(instance, this.style)
    }
  }
}

class RowStyleModify extends CommonStyleModify {

  applyNormalAttribute(instance: RowAttribute): void {
    if (this.style) {
      setNormalAttributeIntoInstance(instance, this.style, this.node)
      instance.constraintSize({
        minWidth: this.style.minWidth || this.style.width,
        maxWidth: this.style.maxWidth,
        minHeight: this.style.minHeight,
        maxHeight: this.style.maxHeight
      })
      if (this.node) {
        instance.alignItems(FlexManager.alignItems<VerticalAlign>(this.node))
        instance.justifyContent(FlexManager.justifyContent(this.node))
      }
    }

    setAnimationAttributeIntoInstance(instance, this.overwriteStyle, this.style || {})
  }
}

class ColumnStyleModify extends CommonStyleModify {
  applyNormalAttribute(instance: ColumnAttribute): void {
    if (this.style) {
      setNormalAttributeIntoInstance(instance, this.style, this.node)
      instance.constraintSize({
        minWidth: this.style.minWidth,
        maxWidth: this.style.maxWidth,
        minHeight: this.style.minHeight || this.style.height,
        maxHeight: this.style.maxHeight
      })
      if (this.node) {
        instance.alignItems(FlexManager.alignItems<HorizontalAlign>(this.node))
        instance.justifyContent(FlexManager.justifyContent(this.node))
      }
    }

    setAnimationAttributeIntoInstance(instance, this.overwriteStyle, this.style || {})
  }
}

export function setAnimationAttributeIntoInstance(instance: CommonAttribute, overwriteStyle: Record<string, TaroAny>, style: TaroStyleType) {
  // Animation 需要提前和 @State 变量绑定才能产生动画效果，因此不能做 if else 判断
  instance.translate({
    x: overwriteStyle.transform?.Translate?.x || style.transform?.Translate?.x,
    y: overwriteStyle.transform?.Translate?.y || style.transform?.Translate?.y,
    z: overwriteStyle.transform?.Translate?.z || style.transform?.Translate?.z,
  })
  instance.scale({
    x: overwriteStyle.transform?.Scale?.x || style.transform?.Scale?.x,
    y: overwriteStyle.transform?.Scale?.y || style.transform?.Scale?.y,
    z: overwriteStyle.transform?.Scale?.z || style.transform?.Scale?.z,
    centerX: overwriteStyle.transformOrigin?.x || style.transformOrigin?.x || 0,
    centerY: overwriteStyle.transformOrigin?.y || style.transformOrigin?.y || 0,
  })
  instance.rotate({
    x: overwriteStyle.transform?.Rotate?.x || style.transform?.Rotate?.x,
    y: overwriteStyle.transform?.Rotate?.y || style.transform?.Rotate?.y,
    z: overwriteStyle.transform?.Rotate?.z || style.transform?.Rotate?.z,
    centerX: overwriteStyle.transformOrigin?.x || style.transformOrigin?.x || 0,
    centerY: overwriteStyle.transformOrigin?.y || style.transformOrigin?.y || 0,
    angle: overwriteStyle.transform?.Rotate?.angle || style.transform?.Rotate?.angle || 0,
  })
}

export function setNormalTextAttributeIntoInstance(instance: TextAttribute | SpanAttribute, style: HarmonyStyle, node?: TaroTextElement | null) {
  if (!isUndefined(style.color)) {
    instance.fontColor(style.color)
  }
  if (!isUndefined(style.fontSize)) {
    instance.fontSize(style.fontSize)
  }
  if (!isUndefined(style.fontWeight)) {
    instance.fontWeight(style.fontWeight)
  }
  if (!isUndefined(style.fontStyle)) {
    instance.fontStyle(style.fontStyle)
  }
  if (!isUndefined(style.fontFamily)) {
    instance.fontFamily(style.fontFamily)
  }
  if (!isUndefined(style.textDecoration)) {
    instance.decoration({
      type: style.textDecoration.type,
      color: style.color
    })
  }
}

export function setSpecialTextAttributeIntoInstance(instance: TextAttribute, style: HarmonyStyle, node?: TaroTextElement | null) {
  if (!isUndefined(style.textAlign)) {
    instance.textAlign(style.textAlign)
  }
  if (!isUndefined(style.verticalAlign)) {
    instance.align(style.verticalAlign)
  }
  if (!isUndefined(style.textOverflow)) {
    instance.textOverflow(style.textOverflow)
  }
  if (!isUndefined(style.whiteSpace) && style.whiteSpace === 'nowrap') {
    instance.maxLines(1)
  }
  if (!isUndefined(style.WebkitLineClamp)) {
    instance.maxLines(style.WebkitLineClamp)
  }
  if (!isUndefined(style.letterSpacing)) {
    instance.letterSpacing(style.letterSpacing)
  }
  if (!isUndefined(style.lineHeight)) {
    instance.lineHeight(style.lineHeight)
  }
}

export function setNormalAttributeIntoInstance(instance: CommonAttribute, style: TaroStyleType, node?: TaroElement | null) {
  if (!isUndefined(style.id)) {
    instance.id(style.id)
    instance.key(style.id)
  }
  if (!isUndefined(style.display) || !isUndefined(style.visibility)) {
    instance.visibility(style.display === 'none' 
      ? Visibility.None : 
      !isUndefined(style.visibility) 
        ? (style.visibility === 'hidden' ? Visibility.Hidden :  Visibility.Visible)
        : Visibility.Visible
    )
  }
  if (!isUndefined(style.flexGrow)) {
    instance.flexGrow(style.flexGrow)
  }
  if (!isUndefined(style.flexShrink)) {
    instance.flexShrink(style.flexShrink)
  }
  if (!isUndefined(style.flexBasis)) {
    instance.flexBasis(style.flexBasis)
  }
  if (!isUndefined(style.alignSelf)) {
    instance.alignSelf(style.alignSelf)
  }
  if (!isUndefined(style.paddingTop) || !isUndefined(style.paddingRight) || !isUndefined(style.paddingBottom) || !isUndefined(style.paddingLeft)) {
    instance.padding({
      top: style.paddingTop,
      right: style.paddingRight,
      bottom: style.paddingBottom,
      left: style.paddingLeft
    })
  }
  if (!isUndefined(style.marginTop) || !isUndefined(style.marginRight) || !isUndefined(style.marginBottom) || !isUndefined(style.marginLeft)) {
    instance.margin({
      top: style.marginTop,
      right: style.marginRight,
      bottom: style.marginBottom,
      left: style.marginLeft
    })
  }
  if (node) {
    instance.width(isMaxWidthView(node as TaroElement) && isUndefined(style.width) ? '100%' : style.width)
  } else {
    if (!isUndefined(style.width)) {
      instance.width(style.width)
    }
  }
  if (!isUndefined(style.height)) {
    instance.height(style.height)
  }
  if (!isUndefined(style.minWidth) || !isUndefined(style.maxWidth) || !isUndefined(style.minHeight) || !isUndefined(style.maxHeight)) {
    instance.constraintSize({
      minWidth: style.minWidth,
      maxWidth: style.maxWidth,
      minHeight: style.minHeight,
      maxHeight: style.maxHeight
    })
  }
  if (!isUndefined(style.backgroundColor)) {
    instance.backgroundColor(style.backgroundColor)
  }
  if (!isUndefined(style.backgroundImage)) {
    if (style.backgroundImage.center) {
      // radialGradient
      instance.radialGradient(style.backgroundImage)
    } else if (style.backgroundImage.colors) {
      // linearGradient
      instance.linearGradient(style.backgroundImage)
    } else {
      instance.backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
    }
  }
  if (!isUndefined(style.backgroundSize)) {
    instance.backgroundImageSize(style.backgroundSize)
  }
  if (!isUndefined(style.backgroundPosition)) {
    if (typeof style.backgroundPosition !== 'number') {
      let pos = computeBackgroundPosition(style)
      instance.backgroundImagePosition({
        x: pos.offsetX,
        y: pos.offsetY,
      })
    } else {
      instance.backgroundImagePosition(style.backgroundPosition)
    }
  }
  if (!isUndefined(style.borderTopStyle) || !isUndefined(style.borderRightStyle) || !isUndefined(style.borderBottomStyle) || !isUndefined(style.borderLeftStyle)) {
    instance.borderStyle({
      top: style.borderTopStyle,
      right: style.borderRightStyle,
      bottom: style.borderBottomStyle,
      left: style.borderLeftStyle
    })
  }
  if (!isUndefined(style.borderTopWidth) || !isUndefined(style.borderRightWidth) || !isUndefined(style.borderBottomWidth) || !isUndefined(style.borderLeftWidth)) {
    instance.borderWidth({
      top: style.borderTopWidth,
      right: style.borderRightWidth,
      bottom: style.borderBottomWidth,
      left: style.borderLeftWidth
    })
  }
  if (!isUndefined(style.borderTopColor) || !isUndefined(style.borderRightColor) || !isUndefined(style.borderBottomColor) || !isUndefined(style.borderLeftColor)) {
    instance.borderColor({
      top: style.borderTopColor,
      right: style.borderRightColor,
      bottom: style.borderBottomColor,
      left: style.borderLeftColor
    })
  }
  if (!isUndefined(style.borderTopLeftRadius) || !isUndefined(style.borderTopRightRadius) || !isUndefined(style.borderBottomLeftRadius) || !isUndefined(style.borderBottomRightRadius)) {
    instance.borderRadius({
      topLeft: style.borderTopLeftRadius,
      topRight: style.borderTopRightRadius,
      bottomLeft: style.borderBottomLeftRadius,
      bottomRight: style.borderBottomRightRadius
    })
  }
  if (!isUndefined(style.opacity)) {
    instance.opacity(style.opacity)
  }
  if (!isUndefined(style.overflow)) {
    instance.clip(style.overflow === 'hidden')
  }
  if (style.position === 'absolute' || style.position === 'fixed') {
    instance.position({
      x: style.left || 0,
      y: style.top || 0,
    })
    // 绝对定位和固定定位在web上都会脱离文档流，因此需要设置zIndex让它相比正常流的元素更上层
    instance.zIndex(1)
  }
  if (style.position === 'relative') {
    instance.offset({
      x: style.left || 0,
      y: style.top || 0,
    })
    // 绝对定位和固定定位在web上都会脱离文档流，因此需要设置zIndex让它相比正常流的元素更上层
    instance.zIndex(1)
  }
  if (!isUndefined(style.zIndex)) {
    // 为了适应position不设置z-index也能高于同层级组件，估且让设置了z-index的会更高一级
    instance.zIndex(style.zIndex + 1)
  }
  // if (!isUndefined(style.transform)) {
  //   if (style.transform.Translate) {
  //     instance.translate({
  //       x: style.transform.Translate.x || 0,
  //       y: style.transform.Translate.y || 0,
  //       z: style.transform.Translate.z || 0,
  //     })
  //   }
  //   if (style.transform.Scale) {
  //     instance.scale({
  //       x: style.transform.Scale.x || 0,
  //       y: style.transform.Scale.y || 0,
  //       z: style.transform.Scale.z || 0,
  //       centerX: style.transformOrigin?.x || 0,
  //       centerY: style.transformOrigin?.y || 0,
  //     })
  //   }
  //   if (style.transform.Rotate) {
  //     instance.rotate({
  //       x: style.transform.Rotate.x || 0,
  //       y: style.transform.Rotate.y || 0,
  //       z: style.transform.Rotate.z || 0,
  //       centerX: style.transformOrigin?.x || 0,
  //       centerY: style.transformOrigin?.y || 0,
  //       angle: style.transform.Rotate.angle
  //     })
  //   }
  // }
}

export const pseudoModify = new PseudoStyleModify()
export const rowModify = new RowStyleModify()
export const columnModify = new ColumnStyleModify()
export const textModify = new TextStyleModify()

export default new CommonStyleModify()