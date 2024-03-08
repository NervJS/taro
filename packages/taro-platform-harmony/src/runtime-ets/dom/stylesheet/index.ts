/* eslint-disable accessor-pairs */
// @ts-nocheck
import { TaroAny } from '../../'
import { BORDER_STYLE_MAP, FlexManager, getTransform } from './util'

import type { HarmonyStyle, HarmonyType, TaroStyleType, TaroTextStyleType } from './type'

export { HarmonyStyle, HarmonyType, TaroStyleType, TaroTextStyleType }

export default class StyleSheet {

  public hmStyle: HarmonyStyle = {}

  get display () {
    return this.hmStyle.display
  }

  set _display (value: string) {
    this.hmStyle.display = value
  }

  get position () {
    return this.hmStyle.position
  }

  set _position (value: string) {
    this.hmStyle.position = value
  }

  get padding () {
    return `${this.hmStyle.paddingTop} ${this.hmStyle.paddingRight} ${this.hmStyle.paddingBottom} ${this.hmStyle.paddingLeft}`
  }

  get paddingTop () {
    return this.hmStyle.paddingTop
  }

  set _paddingTop (value: Length) {
    this.hmStyle.paddingTop = value
  }

  get paddingBottom () {
    return this.hmStyle.paddingBottom
  }

  set _paddingBottom (value: Length) {
    this.hmStyle.paddingBottom = value
  }

  get paddingLeft () {
    return this.hmStyle.paddingLeft
  }

  set _paddingLeft (value: Length) {
    this.hmStyle.paddingLeft = value
  }

  get paddingRight () {
    return this.hmStyle.paddingRight
  }

  set _paddingRight (value: Length) {
    this.hmStyle.paddingRight = value
  }

  get margin () {
    return `${this.hmStyle.marginTop} ${this.hmStyle.marginRight} ${this.hmStyle.marginBottom} ${this.hmStyle.marginLeft}`
  }

  get marginTop () {
    return this.hmStyle.marginTop
  }

  set _marginTop (value: Length) {
    this.hmStyle.marginTop = value
  }

  get marginBottom () {
    return this.hmStyle.marginBottom
  }

  set _marginBottom (value: Length) {
    this.hmStyle.marginBottom = value
  }

  get marginLeft () {
    return this.hmStyle.marginLeft
  }

  set _marginLeft (value: Length) {
    this.hmStyle.marginLeft = value
  }

  get marginRight () {
    return this.hmStyle.marginRight
  }

  set _marginRight (value: Length) {
    this.hmStyle.marginRight = value
  }

  get top () {
    return this.hmStyle.top
  }

  set _top (value: Length) {
    this.hmStyle.top = value
  }

  get left () {
    return this.hmStyle.left
  }

  set _left (value: Length) {
    this.hmStyle.left = value
  }

  get flex () {
    return `${this.hmStyle.flexGrow} ${this.hmStyle.flexShrink} ${this.hmStyle.flexBasis}`
  }

  get flexBasis () {
    return this.hmStyle.flexBasis
  }

  set _flexBasis (value: number | string) {
    this.hmStyle.flexBasis = value
  }

  get flexGrow () {
    return Number(this.hmStyle.flexGrow)
  }

  set _flexGrow (value: number) {
    this.hmStyle.flexGrow = value
  }

  get flexShrink () {
    return Number(this.hmStyle.flexShrink)
  }

  set _flexShrink (value: number) {
    this.hmStyle.flexShrink = value
  }

  get alignSelf () {
    return FlexManager.reverseItemAlign(this.hmStyle.alignSelf)
  }

  set _alignSelf (value: ItemAlign) {
    this.hmStyle.alignSelf = value
  }

  get flexDirection () {
    return FlexManager.reverseDirection(this.hmStyle.flexDirection)
  }

  set _flexDirection (value: FlexDirection) {
    this.hmStyle.flexDirection = value
  }

  get justifyContent () {
    return FlexManager.reverseFlexAlign(this.hmStyle.justifyContent)
  }

  set _justifyContent (value: FlexAlign) {
    this.hmStyle.justifyContent = value
  }

  get alignItems () {
    return FlexManager.reverseItemAlign(this.hmStyle.alignItems)
  }

  set _alignItems (value: ItemAlign) {
    this.hmStyle.alignItems = value
  }

  get alignContent () {
    return FlexManager.reverseFlexAlign(this.hmStyle.alignContent)
  }

  set _alignContent (value: FlexAlign) {
    this.hmStyle.alignContent = value
  }

  get flexWrap () {
    return FlexManager.reverseFlexWrap(this.hmStyle.flexWrap)
  }

  set _flexWrap (value: FlexWrap) {
    this.hmStyle.flexWrap = value
  }

  get width () {
    return this.hmStyle.width
  }

  set _width (value: Length) {
    this.hmStyle.width = value
  }

  get height () {
    return this.hmStyle.height
  }

  set _height (value: Length) {
    this.hmStyle.height = value
  }

  get minHeight () {
    return this.hmStyle.minHeight
  }

  set _minHeight (value: Length) {
    this.hmStyle.minHeight = value
  }

  get maxHeight () {
    return this.hmStyle.maxHeight
  }

  set _maxHeight (value: Length) {
    this.hmStyle.maxHeight = value
  }

  get minWidth () {
    return this.hmStyle.minWidth
  }

  set _minWidth (value: Length) {
    this.hmStyle.minWidth = value
  }

  get maxWidth () {
    return this.hmStyle.maxWidth
  }

  set _maxWidth (value: Length) {
    this.hmStyle.maxWidth = value
  }

  get background () {
    return `${this.backgroundColor} ${this.backgroundImage} ${this.backgroundRepeat} ${this.backgroundSize}`.trim()
  }

  set _background (value: TaroAny) {
    const _backgroundImage: HarmonyType.Background.backgroundImage = value?.image
    if (_backgroundImage) {
      this.hmStyle.backgroundImage = _backgroundImage.src
      if (_backgroundImage.repeat) {
        this.hmStyle.backgroundRepeat = _backgroundImage.repeat
      }
    }
    this.hmStyle.backgroundImageSize = value?.size
    this.hmStyle.backgroundColor = this.hmStyle.backgroundImage ? null : value?.color

    const _backgroundPosition: HarmonyType.Background.backgroundImagePosition = value?.position
    this.hmStyle.backgroundImagePosition = _backgroundPosition
  }

  get backgroundColor () {
    return this.hmStyle.backgroundColor
  }

  set _backgroundColor (value: ResourceColor) {
    this.hmStyle.backgroundColor = value
  }

  get backgroundImage () {
    return this.hmStyle.backgroundImage && `url(${this.hmStyle.backgroundImage})`
  }

  set _backgroundImage (value) {
    this.hmStyle.backgroundImage = value
  }

  get backgroundRepeat () {
    if (this.hmStyle.backgroundRepeat) {
      switch (this.hmStyle.backgroundRepeat) {
        case ImageRepeat.X: return 'repeat-x'; break
        case ImageRepeat.Y: return 'repeat-y'; break
        case ImageRepeat.XY: return 'repeat'; break
        case ImageRepeat.NoRepeat: return 'no-repeat'; break
      } 
    }
  }

  set _backgroundRepeat (value: ImageRepeat[]) {
    this.hmStyle.backgroundRepeat = value
  }

  get backgroundSize () {
    if (this.hmStyle.backgroundImage) {
      return [this.hmStyle.backgroundSize.width, this.hmStyle.backgroundSize.height].join(' ')
    }
  }

  set _backgroundSize (value: HarmonyType.Background.backgroundImageSize[]) {
    this.hmStyle.backgroundSize = value
  }

  get backgroundPosition () {
    if (this.hmStyle.backgroundPosition) {
      switch (this.hmStyle.backgroundPosition) {
        case Alignment.TopStart: return 'left top'; break
        case Alignment.Top: return 'center top'; break
        case Alignment.TopEnd: return 'right top'; break
        case Alignment.Start: return 'left center'; break
        case Alignment.Center: return 'center center'; break
        case Alignment.End: return 'right center'; break
        case Alignment.BottomStart: return 'left bottom'; break
        case Alignment.Bottom: return 'center bottom'; break
        case Alignment.BottomEnd: return 'right bottom'; break
        default: {
          if (this.hmStyle.backgroundPosition) {
            return [this.hmStyle.backgroundPosition, this.hmStyle.backgroundPosition.y].join(' ')
          }
        }
      }
    }
  }
  
  set _backgroundPosition (value: HarmonyType.Background.backgroundImagePosition[]) {
    this.hmStyle.backgroundPosition = value
  }

  get border () {
    return [this.borderWidth, this.borderStyle, this.bordercolor].join(' ')
  }

  get borderWidth () {
    return this.hmStyle.borderWidth
  }

  set _borderWidth (value: Length | EdgeWidths) {
    this.hmStyle.borderWidth = value
  }

  get borderLeftWidth () { 
    return this.hmStyle.borderLeftWidth
  }

  set _borderLeftWidth (value: Length) {
    this.hmStyle.borderLeftWidth = value
  }

  get borderRightWidth () {
    return this.hmStyle.borderRightWidth
  }

  set _borderRightWidth (value: Length) {
    this.hmStyle.borderRightWidth = value
  }

  get borderTopWidth () {
    return this.hmStyle.borderTopWidth
  }

  set _borderTopWidth (value: Length) {
    this.hmStyle.borderTopWidth = value
  }

  get borderBottomWidth () {
    return this.hmStyle.borderBottomWidth
  }

  set _borderBottomWidth (value: Length) {
    this.hmStyle.borderBottomWidth = value
  }

  get borderColor () {
    return this.hmStyle.borderColor
  }

  set _borderColor (value: ResourceColor | EdgeColors) {
    this.hmStyle.borderColor = value
  }

  get borderLeftColor () {
    return this.hmStyle.borderLeftColor
  }

  set _borderLeftColor (value: ResourceColor) {
    this.hmStyle.borderLeftColor = value
  }

  get borderRightColor () {
    return this.hmStyle.borderRightColor
  }

  set _borderRightColor (value: ResourceColor) {
    this.hmStyle.borderRightColor = value
  }

  get borderTopColor () {
    return this.hmStyle.borderTopColor
  }

  set _borderTopColor (value: ResourceColor) {
    this.hmStyle.borderTopColor = value
  }

  get borderBottomColor () {
    return this.hmStyle.borderBottomColor
  }

  set _borderBottomColor (value: ResourceColor) {
    this.hmStyle.borderBottomColor = value
  }

  get borderStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderStyle)
  }

  set _borderStyle (value: BorderStyle | EdgeStyles) {
    this.hmStyle.borderStyle = value
  }

  get borderLeftStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderLeftStyle)
  }

  set _borderLeftStyle (value: BorderStyle) {
    this.hmStyle.borderLeftStyle = value
  }

  get borderRightStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderRightStyle)
  }

  set _borderRightStyle (value: BorderStyle) {
    this.hmStyle.borderRightStyle = value
  }

  get borderTopStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderTopStyle)
  }

  set _borderTopStyle (value: BorderStyle) {
    this.hmStyle.borderTopStyle = value
  }

  get borderBottomStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderBottomStyle)
  }

  set _borderBottomStyle (value: BorderStyle) {
    this.hmStyle.borderBottomStyle = value
  }

  get borderRadius () {
    return this.hmStyle.borderRadius
  }

  set _borderRadius (value: Length | BorderRadiuses) {
    this.hmStyle.borderRadius = value
  }

  get borderTopLeftRadius () {
    return this.hmStyle.borderTopLeftRadius
  }

  set _borderTopLeftRadius (value: Length) {
    this.hmStyle.borderTopLeftRadius = value
  }

  get borderTopRightRadius () {
    return this.hmStyle.borderTopRightRadius
  }

  set _borderTopRightRadius (value: Length) {
    this.hmStyle.borderTopRightRadius = value
  }

  get borderBottomLeftRadius () {
    return this.hmStyle.borderBottomLeftRadius
  }

  set _borderBottomLeftRadius (value: Length) {
    this.hmStyle.borderBottomLeftRadius = value
  }

  get borderBottomRightRadius () {
    return this.hmStyle.borderBottomRightRadius
  }

  set _borderBottomRightRadius (value: Length) {
    this.hmStyle.borderBottomRightRadius = value
  }
  
  get zIndex (): number {
    return Number(this.hmStyle.zIndex)
  }

  set _zIndex (value: string) {
    this.hmStyle.zIndex = Number(value)
  }

  get opacity () {
    return this.hmStyle.opacity
  }

  set _opacity (value: number) {
    this.hmStyle.opacity = value
  }

  get overflow () {
    return this.hmStyle.overflow ? 'hidden' : 'visible'
  }

  set _overflow (value: string) {
    this.hmStyle.overflow = value === 'hidden'
  }

  get focus () {
    return !!this.hmStyle.focus
  }

  set focus (value: boolean) {
    this.hmStyle.focus = value
  }

  // 文本相关
  get color () {
    return this.hmStyle.color
  }

  set _color (value: ResourceColor) {
    this.hmStyle.color = value
  }

  get fontSize () {
    return this.hmStyle.fontSize
  }

  set _fontSize (value: number | string | Resource) {
    this.hmStyle.fontSize = value
  }

  get fontWeight () {
    return this.hmStyle.fontWeight
  }

  set _fontWeight (value: number | FontWeight | string) {
    this.hmStyle.fontWeight = value
  }

  get fontStyle () {
    switch (this.hmStyle.fontStyle) {
      case FontStyle.Italic: return 'italic'; break
      case FontStyle.Normal: return 'normal'; break
      default: return ''
    }
  }

  set _fontStyle (value: FontStyle) {
    this.hmStyle.fontStyle = value
  }

  get fontFamily () {
    return this.hmStyle.fontFamily
  }

  set fontFamily (value: string) {
    this.hmStyle.fontFamily = value
  }
  
  get textAlign () {
    switch (this.hmStyle.textAlign) {
      case TextAlign.End: return 'right'; break
      case TextAlign.Center: return 'center'; break
      case TextAlign.Start: return 'left'; break
      default: return ''
    }
  }

  set _textAlign (value: TextAlign) {
    this.hmStyle.textAlign = value
  }

  get verticalAlign() {
    switch (this.hmStyle.verticalAlign) {
      case Alignment.Center: return 'middle'; break
      case Alignment.Top: return 'top'; break
      case Alignment.Bottom: return 'bottom'; break
      default: return ''
    }
  }

  set _align (value: string) {
    this.hmStyle.verticalAlign = value
  }

  get lineHeight () {
    return this.hmStyle.lineHeight
  }

  set _lineHeight (value: string | number | Resource) {
    this.hmStyle.lineHeight = value
  }

  get letterSpacing () {
    return this.hmStyle.letterSpacing
  }

  set _letterSpacing (value: number | string) {
    this.hmStyle.letterSpacing = value
  }
 
  get textDecoration () {
    switch (this.hmStyle.decoration) {
      case TextDecorationType.Underline: return 'underline'; break
      case TextDecorationType.Overline: return 'overline'; break
      case TextDecorationType.LineThrough: return 'line-through'; break
      case TextDecorationType.None: return 'none'; break
      default: return ''
    }
  }

  set _decoration (value: TextDecorationType) {
    this.hmStyle.textDecoration = value
  }

  get textOverflow () {
    if (this.hmStyle.textOverflow) {
      switch (this.hmStyle.textOverflow.overflow) {
        case TextOverflow.Clip: return 'clip'; break
        case TextOverflow.Ellipsis: return 'ellipsis'; break
        case TextOverflow.MARQUEE: return 'marquee'; break
        default: return 'none'
      }
    }
  }

  set _textOverflow (value: TextOverflow) {
    switch (value.overflow) {
      case TextOverflow.Clip: 
      case TextOverflow.Ellipsis:
      case TextOverflow.None: this.hmStyle.WebkitLineClamp = this.hmStyle.WebkitLineClamp || 1; break
      default: break
    }
    this.hmStyle.textOverflow = value
  }

  get WebkitLineClamp () {
    return Number(this.hmStyle.WebkitLineClamp)
  }

  set WebkitLineClamp (value: number) {
    this.hmStyle.WebkitLineClamp = value
  }

  set _WebkitLineClamp (value: number) {
    this.hmStyle.WebkitLineClamp = value
  }
  
  get transform () {
    return this.hmStyle.transform
  }

  set _transform (value: HarmonyType.Transform.Transform) {
    this.hmStyle.transform = getTransform(value)
  }

  get transformOrigin () {
    return this.hmStyle.transformOrigin
  }

  set _transformOrigin(value) {
    this.hmStyle.transformOrigin = value
  }

  get content () {
    return this.hmStyle._content
  }

  set _content (value) {
    this.hmStyle.content = value
  }
}
