/* eslint-disable accessor-pairs */
// @ts-nocheck
import matrix4 from '@ohos.matrix4'

import { ObjectAssign, TaroAny } from '../../'
import { FlexManager, getNodeMarginOrPaddingData, getUnit } from './util'

export interface HarmonyStyle extends TaroStyleType {
  textAlign?: TextAlign
  textOverflow?: HarmonyType.Overflow
  maxLines?: number
  letterSpacing?: number | string
}

export interface TaroStyleType {
  id?: string

  padding?: Margin | Length
  margin?: Margin | Length
  width?: Length
  height?: Length
  constraintSize?: ConstraintSizeOptions

  // position
  top?: Length
  left?: Length

  // flex
  flexBasis?: number | string
  flexGrow?: number
  flexShrink?: number
  alignSelf?: ItemAlign
  direction?: FlexDirection
  justifyContent?: FlexAlign
  alignItems?: ItemAlign
  wrap?: FlexWrap
  alignContent?: FlexAlign

  // background
  backgroundColor?: ResourceColor
  backgroundImage?: ResourceStr
  backgroundRepeat?: ImageRepeat
  backgroundImageSize?: SizeOptions | ImageSize

  // transform
  rotate?: HarmonyType.Transform.Rotate
  translate?: HarmonyType.Transform.Translate
  scale?: HarmonyType.Transform.Scale
  transform?: HarmonyType.Transform.Transform

  // border
  borderWidth?: Length | EdgeWidths
  borderColor?: ResourceColor | EdgeColors
  borderStyle?: BorderStyle | EdgeStyles
  borderRadius?: Length | BorderRadiuses

  // text
  color?: ResourceColor
  fontSize?: number | string | Resource
  fontStyle?: FontStyle
  fontWeight?: number | FontWeight | string
  fontFamily?: string | Resource
  lineHeight?: string | number | Resource
  decoration?: TextDecorationType

  // gradient
  linearGradient?: HarmonyType.LinearGradient

  // other
  opacity?: number | Resource
  zIndex?: number
  clip?: boolean
  focus?: boolean
}

export interface TaroTextStyleType {
  textAlign?: TextAlign
  textOverflow?: HarmonyType.Overflow
  maxLines?: number
  letterSpacing?: number | string
}

export namespace HarmonyType {
  export interface FlexOptions {
    direction?: FlexDirection
    justifyContent?: FlexAlign
    alignItems?: ItemAlign
  }
  export interface LinearGradient {
    angle?: number | string
    direction?: GradientDirection
    colors: Array<[ResourceColor, number]>
    repeating?: boolean
  }
  export interface Overflow {
    overflow: TextOverflow
  }
  export interface RadioStyle {
    checkedBackgroundColor?: ResourceColor
    uncheckedBorderColor?: ResourceColor
    indicatorColor?: ResourceColor
  }
  export namespace Background {
    export type backgroundColor = ResourceColor
    export interface backgroundImage {
      src: ResourceStr
      repeat?: ImageRepeat
    }
    export type backgroundImageSize = SizeOptions | ImageSize
    export type backgroundImagePosition = Position | Alignment
  }
  export namespace Transform {
    export interface Rotate {
      x?: number
      y?: number
      z?: number
      angle: number | string
      centerX?: number | string
      centerY?: number | string
      center?: number
      perspective?: number
    }
    export interface Translate {
      x?: number | string
      y?: number | string
      z? : number | string
    }
    export interface Scale {
      x?: number
      y?: number
      z?: number
      centerX?: number | string
      centerY?: number | string
    }
    export type Transform = matrix4.Matrix4Transit
  }
}


export default class StyleSheet {

  public _st: HarmonyStyle = {}

  get display () {
    return this._st.display
  }

  set display (value: string) {
    this._st.display = value
  }

  get position () {
    return this._st.position
  }

  set position (value: string) {
    this._st.position = value
  }

  get padding () {
    return this._st.padding
    // const { top = 0, right = 0, bottom = 0, left = 0 } = this._st.padding || {}
    // return `${top} ${right} ${bottom} ${left}`
  }

  set padding (value: string) {
    this._st.padding = getNodeMarginOrPaddingData(value)
  }

  set _padding (value: Margin) {
    this._st.padding = value
  }

  get paddingTop () {
    return this._st.padding?.top
  }

  set paddingTop (value: string) {
    this._st.padding = ObjectAssign({}, this._st.padding, { top: getUnit(value) })
  }

  get paddingBottom () {
    return this._st.padding?.bottom
  }

  set paddingBottom (value: string) {
    this._st.padding = ObjectAssign({}, this._st.padding, { bottom: getUnit(value) })
  }

  get paddingRight () {
    return this._st.padding?.right
  }

  set paddingRight (value: string) {
    this._st.padding = ObjectAssign({}, this._st.padding, { right: getUnit(value) })
  }

  get paddingLeft () {
    return this._st.padding?.left
  }

  set paddingLeft (value: string) {
    this._st.padding = ObjectAssign({}, this._st.padding, { left: getUnit(value) })
  }

  get margin () {
    return this._st.margin
    // const { top = 0, right = 0, bottom = 0, left = 0 } = this._st.margin || {}
    // return `${top} ${right} ${bottom} ${left}`
  }

  set margin (value: string) {
    this._st.margin = getNodeMarginOrPaddingData(value)
  }

  set _margin (value: Margin) {
    this._st.margin = value
  }

  get marginTop () {
    return this._st.margin?.top
  }

  set marginTop (value: string) {
    this._st.margin = ObjectAssign({}, this._st.margin, { top: getUnit(value) })
  }

  get marginBottom () {
    return this._st.margin?.bottom
  }

  set marginBottom (value: string) {
    this._st.margin = ObjectAssign({}, this._st.margin, { bottom: getUnit(value) })
  }

  get marginRight () {
    return this._st.margin?.right
  }

  set marginRight (value: string) {
    this._st.margin = ObjectAssign({}, this._st.margin, { right: getUnit(value) })
  }

  get marginLeft () {
    return this._st.margin?.left
  }

  set marginLeft (value: string) {
    this._st.margin = ObjectAssign({}, this._st.margin, { left: getUnit(value) })
  }

  get top () {
    return this._st.top
  }

  set top (value: string | number) {
    this._st.top = getUnit(value)
  }

  set _top (value: Length) {
    this._st.top = value
  }

  get left () {
    return this._st.left
  }

  set left (value: string | number) {
    this._st.left = getUnit(value)
  }

  set _left (value: Length) {
    this._st.left = value
  }

  get flexBasis () {
    return this._st.flexBasis
  }

  set flexBasis (value: string) {
    this._st.flexBasis = getUnit(value)
  }

  set _flexBasis (value: number | string) {
    this._st.flexBasis = value
  }

  get flexGrow () {
    return Number(this._st.flexGrow)
  }

  set flexGrow (value: number | string) {
    this._st.flexGrow = Number(value)
  }

  set _flexGrow (value: number) {
    this._st.flexGrow = value
  
  }

  get flexShrink () {
    return Number(this._st.flexShrink)
  }

  set flexShrink (value: number | string) {
    this._st.flexShrink = Number(value)
  }

  set _flexShrink (value: number) {
    this._st.flexShrink = value
  }

  get alignSelf () {
    return this._st.alignSelf
  }

  set alignSelf (value: string | number) {
    this._st.alignSelf = FlexManager.itemAlign(value)
  }

  set _alignSelf (value: ItemAlign) {
    this._st.alignSelf = value
  }

  set _flexOptions (value) {
    if (typeof value.direction !== 'undefined') {
      this._st.direction = value.direction
    }
    if (typeof value.justifyContent !== 'undefined') {
      this._st.justifyContent = value.justifyContent
    }
    if (typeof value.alignItems !== 'undefined') {
      this._st.alignItems = value.alignItems
    }
  }

  get flexDirection () {
    return this._st.direction
  }

  set flexDirection (value: string) {
    this._st.direction = FlexManager.direction(value)
  }

  set _direction (value: FlexDirection) {
    this._st.direction = value
  }

  get justifyContent () {
    return this._st.justifyContent
  }

  set justifyContent (value: string) {
    this._st.justifyContent = FlexManager.flexAlign(value)
  }

  set _justifyContent (value: FlexAlign) {
    this._st.justifyContent = value
  }

  get alignItems () {
    return this._st.alignItems
  }

  set alignItems (value: string) {
    this._st.alignItems = FlexManager.itemAlign(value)
  }

  set _alignItems (value: ItemAlign) {
    this._st.alignItems = value
  }

  get width () {
    return this._st.width
  }

  set width (value: string | number) {
    this._st.width = getUnit(value)
  }

  set _width (value: Length) {
    this._st.width = value
  }

  get height () {
    return this._st.height
  }

  set height (value: string | number) {
    this._st.height = getUnit(value)
  }

  set _height (value: Length) {
    this._st.height = value
  }
  
  set _constraintSize(value: ConstraintSizeOptions) {
    this._st.constraintSize = value
  }

  get minHeight () {
    return this._st.constraintSize?.minHeight
  }

  set minHeight (value: string | number) {
    this._minHeight = getUnit(value)
  }

  get maxHeight () {
    return this._st.constraintSize?.maxHeight
  }

  set maxHeight (value: string | number) {
    this._maxHeight = getUnit(value)
  }

  get minWidth () {
    return this._st.constraintSize?.minWidth
  }

  set minWidth (value: string | number) {
    this._minWidth = getUnit(value)
  }

  get maxWidth () {
    return this._st.constraintSize?.maxWidth
  }

  set maxWidth (value: string | number) {
    this._maxWidth = getUnit(value)
  }

  get background () {
    return `${this.backgroundColor} ${this.backgroundImage} ${this.backgroundRepeat} ${this.backgroundSize}`.trim()
  }

  set background (value: string) {
    // const [color, image, repeat, size] = value.split(' ')
    // this.backgroundColor = color
    // this.backgroundImage = image
    // this.backgroundRepeat = repeat
    // this.backgroundSize = size
  }

  set _background (value: TaroAny) {
    const _backgroundImage: HarmonyType.Background.backgroundImage = value?.image?.[0]
    if (_backgroundImage) {
      this._st.backgroundImage = _backgroundImage.src
      if (_backgroundImage.repeat) {
        this._st.backgroundRepeat = _backgroundImage.repeat
      }
    }
    this._st.backgroundImageSize = value?.size?.[0]
    this._st.backgroundColor = this._st.backgroundImage ? null : value?.color
  }

  get backgroundColor () {
    return this._st.backgroundColor
  }

  set backgroundColor (value: string) {
    this._st.backgroundColor = value
  }

  get backgroundImage () {
    return this._st.backgroundImage
  }

  set backgroundImage (value: string) {
    if (typeof value === 'string' && value.indexOf('url(') !== -1 && value.indexOf(')') !== -1) {
      // 如果包含 url()，则说明是 background-image 属性
      const match = value.match(new RegExp('url\\([\'"]?(.*?)[\'"]?\\)'))
      if (match) {
        this._st.backgroundImage = match[1]
      }
    }
  }

  get backgroundRepeat () {
    return this._st.backgroundRepeat
  }

  set backgroundRepeat (value: string) {
    if (typeof value === 'string') {
      switch (value) {
        case 'repeat-x': this._st.backgroundRepeat = ImageRepeat.X; break
        case 'repeat-y': this._st.backgroundRepeat = ImageRepeat.Y; break
        case 'no-repeat': this._st.backgroundRepeat = ImageRepeat.NoRepeat; break
        default: this._st.backgroundRepeat = ImageRepeat.XY; break
      }
    }
  }

  get backgroundSize () {
    if (this._st.backgroundImage) {
      return this._st.backgroundImageSize
    }
  }

  set backgroundSize (value: string) {
    if (typeof value === 'string') {
      const sizes = value.split(' ')
      if (sizes.length === 1) {
        this._st.backgroundImageSize = { width: getUnit(sizes[0]) }
      } else if (sizes.length === 2) {
        this._st.backgroundImageSize = { width: getUnit(sizes[0]), height: getUnit(sizes[1]) }
      }
    }
  }

  get border () {
    return `$${this._st.borderWidth} ${this._st.borderStyle} ${this._st.borderColor}`
  }

  set border (value: string) {
    const [width, style, color] = value.split(' ')
    this._st.borderWidth = getUnit(width)
    this._st.borderStyle = BORDER_STYLE_MAP.get(style)
    this._st.borderColor = color
  }

  get borderWidth () {
    return this._st.borderWidth
  }

  set borderWidth (value: string) {
    this._st.borderWidth = getUnit(value)
  }

  set _borderWidth (value: Length | EdgeWidths) {
    this._st.borderWidth = value
  }

  get borderColor () {
    return this._st.borderColor
  }

  set borderColor (value: string) {
    this._st.borderColor = value
  }

  set _borderColor (value: ResourceColor | EdgeColors) {
    this._st.borderColor = value
  }

  get borderStyle () {
    return this._st.borderStyle
  }

  set borderStyle (value: string) {
    this._st.borderStyle = BORDER_STYLE_MAP.get(value)
  }

  set _borderStyle (value: BorderStyle | EdgeStyles) {
    this._st.borderStyle = value
  }
  
  get borderRadius () {
    return this._st.borderRadius
  }

  set borderRadius (value: string) {
    this._st.borderRadius = getUnit(value)
  }

  set _borderRadius (value: Length | BorderRadiuses) {
    this._st.borderRadius = value
  }

  get zIndex (): number {
    return Number(this._st.zIndex)
  }

  set zIndex (value: string) {
    this._st.zIndex = Number(value)
  }

  set _zIndex (value: number) {
    this._st.zIndex = value
  }

  get opacity () {
    return this._st.opacity
  }

  set opacity (value: string) {
    this._st.opacity = Number(value)
  }

  set _opacity (value: number) {
    this._st.opacity = value
  }

  get overflow () {
    return this._st.clip ? 'hidden' : 'visible'
  }

  set overflow (value: string) {
    this._st.clip = value === 'hidden'
  }

  set _overflow (value: boolean) {
    this._st.clip = value
  }

  get focus () {
    return !!this._st.focus
  }

  set focus (value: boolean) {
    this._st.focus = value
  }

  set _focus (value: boolean) {
    this._st.focus = value
  }

  // 文本相关
  get color () {
    return this._st.color
  }

  set color (value: string) {
    this._st.color = value
  }

  set _color (value: ResourceColor) {
    this._st.color = value
  }

  get fontSize () {
    return this._st.fontSize
  }

  set fontSize (value: string) {
    this._st.fontSize = getUnit(value)
  }

  set _fontSize (value: number | string | Resource) {
    this._st.fontSize = value
  }

  get fontWeight () {
    return this._st.fontWeight
  }

  set fontWeight (value: string) {
    this._st.fontWeight = value
  }

  set _fontWeight (value: number | FontWeight | string) {
    this._st.fontWeight = value
  }

  get fontFamily () {
    return this._st.fontFamily
  }

  set fontFamily (value: string) {
    this._st.fontFamily = value
  }

  set _fontFamily (value: string | Resource) {
    this._st.fontFamily = value
  }
  
  get textAlign (): TextAlign {
    return this._st.textAlign
  }

  set textAlign (value: string) {
    this._st.textAlign = getTextAlign(value)
  }

  set _textAlign (value: TextAlign) {
    this._st.textAlign = value
  }

  get lineHeight () {
    return this._st.lineHeight
  }

  set lineHeight (value: string) {
    this._st.lineHeight = getUnit(value)
  }

  set _lineHeight (value: string | number | Resource) {
    this._st.lineHeight = value
  }

  get letterSpacing () {
    return this._st.letterSpacing
  }

  set letterSpacing (value: string) {
    this._st.letterSpacing = getUnit(value)
  }

  set _letterSpacing (value: number | string) {
    this._st.letterSpacing = value
  }
 
  get textDecoration () {
    return this._st.decoration
    // switch (this._st.decoration) {
    //   case TextDecorationType.Underline: return 'underline'; break
    //   case TextDecorationType.Overline: return 'overline'; break
    //   case TextDecorationType.LineThrough: return 'line-through'; break
    //   case TextDecorationType.None: return 'none'; break
    //   default: return ''
    // }
  }

  set textDecoration (value: string) {
    if (typeof value === 'string') {
      switch (value) {
        case 'underline': this._st.decoration = TextDecorationType.Underline; break
        case 'overline': this._st.decoration = TextDecorationType.Overline; break
        case 'line-through': this._st.decoration = TextDecorationType.LineThrough; break
        default: this._st.decoration = TextDecorationType.None; break
      }
    }
  }

  set _textDecoration (value: TextDecorationType) {
    this._st.decoration = value
  }

  get textOverflow () {
    return this._st.textOverflow
    // if (this._st.textOverflow) {
    //   switch (this._st.textOverflow.overflow) {
    //     case TextOverflow.Clip: return 'clip'; break
    //     case TextOverflow.Ellipsis: return 'ellipsis'; break
    //     case TextOverflow.MARQUEE: return 'marquee'; break
    //     default: return 'none'
    //   }
    // }
  }

  set textOverflow (value: string) {
    if (typeof value === 'string') {
      let overflow = TextOverflow.None
      switch (value) {
        case 'clip': overflow = TextOverflow.Clip; break
        case 'ellipsis': overflow = TextOverflow.Ellipsis; break
        case 'marquee': overflow = TextOverflow.MARQUEE; break
      }
      this._st.textOverflow = {
        overflow
      }
    }
  }

  set _textOverflow (value: TextOverflow) {
    this._st.textOverflow = value
  }

  get WebkitLineClamp () {
    return Number(this._st.maxLines)
  }

  set WebkitLineClamp (value: string | number) {
    this._st.maxLines = Number(value)
  }

  set _WebkitLineClamp (value: number) {
    this._st.maxLines = value
  }


  get linearGradient (): HarmonyType.LinearGradient {
    return this._st.linearGradient
  }

  set _linearGradient (value: HarmonyType.LinearGradient[]) {
    this._st.linearGradient = value?.[0]
  }
  
  get transform () {
    return this._st.transform
  }

  set _tranform (value: HarmonyType.Transform.Transform) {
    this._st.transform = value
  }
}




class BORDER_STYLE_MAP {
  static solid = BorderStyle.Solid
  static dotted = BorderStyle.Dotted
  static dashed = BorderStyle.Dashed

  static get(type: string): BorderStyle {
    switch (type) {
      case 'dotted': return BorderStyle.Dotted
      case 'dashed': return BorderStyle.Dashed
      default: return BorderStyle.Solid
    }
  }
}

function getTextAlign (value: string): TextAlign {
  switch (value) {
    case 'right':
      return TextAlign.End
    case 'center':
      return TextAlign.Center
    default:
      return TextAlign.Start
  }
}