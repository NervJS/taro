/* eslint-disable accessor-pairs */
// @ts-nocheck
import { BORDER_STYLE_MAP, FlexManager } from './util'

import type { HarmonyStyle, HarmonyType, TaroStyleType, TaroTextStyleType } from './type'

export { HarmonyStyle, HarmonyType, TaroStyleType, TaroTextStyleType }

export default class StyleSheet {
  public hmStyle: HarmonyStyle = {}

  get display () {
    return this.hmStyle.display
  }

  get position () {
    return this.hmStyle.position
  }

  get padding () {
    return `${this.hmStyle.paddingTop} ${this.hmStyle.paddingRight} ${this.hmStyle.paddingBottom} ${this.hmStyle.paddingLeft}`
  }

  get paddingTop () {
    return this.hmStyle.paddingTop
  }

  get paddingBottom () {
    return this.hmStyle.paddingBottom
  }

  get paddingLeft () {
    return this.hmStyle.paddingLeft
  }

  get paddingRight () {
    return this.hmStyle.paddingRight
  }

  get margin () {
    return `${this.hmStyle.marginTop} ${this.hmStyle.marginRight} ${this.hmStyle.marginBottom} ${this.hmStyle.marginLeft}`
  }

  get marginTop () {
    return this.hmStyle.marginTop
  }

  get marginBottom () {
    return this.hmStyle.marginBottom
  }

  get marginLeft () {
    return this.hmStyle.marginLeft
  }

  get marginRight () {
    return this.hmStyle.marginRight
  }

  get top () {
    return this.hmStyle.top
  }

  get left () {
    return this.hmStyle.left
  }

  get right () {
    return this.hmStyle.right
  }

  get bottom () {
    return this.hmStyle.bottom
  }

  get flex () {
    return `${this.hmStyle.flexGrow} ${this.hmStyle.flexShrink} ${this.hmStyle.flexBasis}`
  }

  get flexBasis () {
    return this.hmStyle.flexBasis
  }

  get flexGrow () {
    return Number(this.hmStyle.flexGrow)
  }

  get flexShrink () {
    return Number(this.hmStyle.flexShrink)
  }

  get alignSelf () {
    return FlexManager.reverseItemAlign(this.hmStyle.alignSelf)
  }

  get flexDirection () {
    return FlexManager.reverseDirection(this.hmStyle.flexDirection)
  }

  get justifyContent () {
    return FlexManager.reverseFlexAlign(this.hmStyle.justifyContent)
  }

  get alignItems () {
    return FlexManager.reverseItemAlign(this.hmStyle.alignItems)
  }

  get alignContent () {
    return FlexManager.reverseFlexAlign(this.hmStyle.alignContent)
  }

  get flexWrap () {
    return FlexManager.reverseFlexWrap(this.hmStyle.flexWrap)
  }

  get width () {
    return this.hmStyle.width
  }

  get height () {
    return this.hmStyle.height
  }

  get minHeight () {
    return this.hmStyle.minHeight
  }

  get maxHeight () {
    return this.hmStyle.maxHeight
  }

  get minWidth () {
    return this.hmStyle.minWidth
  }

  get maxWidth () {
    return this.hmStyle.maxWidth
  }

  get background () {
    return `${this.backgroundColor} ${this.backgroundImage} ${this.backgroundRepeat} ${this.backgroundSize}`.trim()
  }

  get backgroundColor () {
    return this.hmStyle.backgroundColor
  }

  get backgroundImage () {
    return this.hmStyle.backgroundImage && `url(${this.hmStyle.backgroundImage})`
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

  get backgroundSize () {
    if (this.hmStyle.backgroundImage) {
      return [this.hmStyle.backgroundSize.width, this.hmStyle.backgroundSize.height].join(' ')
    }
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

  get border () {
    return [this.borderWidth, this.borderStyle, this.bordercolor].join(' ')
  }

  get borderWidth () {
    return this.hmStyle.borderWidth
  }

  get borderLeftWidth () {
    return this.hmStyle.borderLeftWidth
  }

  get borderRightWidth () {
    return this.hmStyle.borderRightWidth
  }

  get borderTopWidth () {
    return this.hmStyle.borderTopWidth
  }

  get borderBottomWidth () {
    return this.hmStyle.borderBottomWidth
  }

  get borderColor () {
    return this.hmStyle.borderColor
  }

  get borderLeftColor () {
    return this.hmStyle.borderLeftColor
  }

  get borderRightColor () {
    return this.hmStyle.borderRightColor
  }

  get borderTopColor () {
    return this.hmStyle.borderTopColor
  }

  get borderBottomColor () {
    return this.hmStyle.borderBottomColor
  }

  get borderStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderStyle)
  }

  get borderLeftStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderLeftStyle)
  }

  get borderRightStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderRightStyle)
  }

  get borderTopStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderTopStyle)
  }

  get borderBottomStyle () {
    return BORDER_STYLE_MAP.reverse(this.hmStyle.borderBottomStyle)
  }

  get borderRadius () {
    return this.hmStyle.borderRadius
  }

  get borderTopLeftRadius () {
    return this.hmStyle.borderTopLeftRadius
  }

  get borderTopRightRadius () {
    return this.hmStyle.borderTopRightRadius
  }

  get borderBottomLeftRadius () {
    return this.hmStyle.borderBottomLeftRadius
  }

  get borderBottomRightRadius () {
    return this.hmStyle.borderBottomRightRadius
  }

  get zIndex () {
    return this.hmStyle.zIndex
  }

  get opacity () {
    return this.hmStyle.opacity
  }

  get overflow () {
    return this.hmStyle.overflow ? 'hidden' : 'visible'
  }

  get focus () {
    return !!this.hmStyle.focus
  }

  // 文本相关
  get color () {
    return this.hmStyle.color
  }

  get fontSize () {
    return this.hmStyle.fontSize
  }

  get fontWeight () {
    return this.hmStyle.fontWeight
  }

  get fontStyle () {
    switch (this.hmStyle.fontStyle) {
      case FontStyle.Italic: return 'italic'; break
      case FontStyle.Normal: return 'normal'; break
      default: return ''
    }
  }

  get fontFamily () {
    return this.hmStyle.fontFamily
  }

  get textAlign () {
    switch (this.hmStyle.textAlign) {
      case TextAlign.End: return 'right'; break
      case TextAlign.Center: return 'center'; break
      case TextAlign.Start: return 'left'; break
      default: return ''
    }
  }

  get verticalAlign() {
    switch (this.hmStyle.verticalAlign) {
      case Alignment.Center: return 'middle'; break
      case Alignment.Top: return 'top'; break
      case Alignment.Bottom: return 'bottom'; break
      default: return ''
    }
  }

  get lineHeight () {
    return this.hmStyle.lineHeight
  }

  get letterSpacing () {
    return this.hmStyle.letterSpacing
  }

  get textDecoration () {
    if (this.hmStyle.textDecoration) {
      switch (this.hmStyle.textDecoration.type) {
        case TextDecorationType.Underline: return 'underline'; break
        case TextDecorationType.Overline: return 'overline'; break
        case TextDecorationType.LineThrough: return 'line-through'; break
        case TextDecorationType.None: return 'none'; break
        default: return ''
      }
    }
    return ''
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

  get WebkitLineClamp () {
    return Number(this.hmStyle.WebkitLineClamp)
  }

  get transform () {
    return this.hmStyle.transform
  }

  get transformOrigin () {
    return this.hmStyle.transformOrigin
  }

  get content () {
    return this.hmStyle._content
  }
}
