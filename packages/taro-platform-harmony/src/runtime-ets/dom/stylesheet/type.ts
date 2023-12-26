// @ts-nocheck
import matrix4 from '@ohos.matrix4'

export interface HarmonyStyle extends TaroStyleType {
  textAlign?: TextAlign
  textOverflow?: HarmonyType.Overflow
  WebkitLineClamp?: number
  letterSpacing?: number | string
}

export interface TaroStyleType {
  id?: string

  paddingTop?: Length
  paddingRight?: Length
  paddingBottom?: Length
  paddingLeft?: Length

  marginTop?: Length
  marginRight?: Length
  marginBottom?: Length
  marginLeft?: Length

  width?: Length
  height?: Length

  minHeight?: Length
  maxHeight?: Length
  minWidth?: Length
  maxWidth?: Length

  display?: 'flex' | 'block' | 'none'

  // position
  position?: 'relative' | 'absolute' | 'fixed'
  top?: Length
  left?: Length

  // flex
  flexBasis?: number | string
  flexGrow?: number
  flexShrink?: number
  alignSelf?: ItemAlign
  flexDirection?: FlexDirection
  justifyContent?: FlexAlign
  alignItems?: ItemAlign
  flexWrap?: FlexWrap
  alignContent?: FlexAlign

  // background
  backgroundColor?: ResourceColor
  backgroundImage?: HarmonyType.Background.BackgroundImage
  backgroundRepeat?: ImageRepeat
  backgroundSize?: SizeOptions | ImageSize
  backgroundPosition?: Position | Alignment

  // transform
  rotate?: HarmonyType.Transform.Rotate
  translate?: HarmonyType.Transform.Translate
  scale?: HarmonyType.Transform.Scale
  transform?: HarmonyType.Transform.Transform
  transformOrigin?: HarmonyType.Transform.Origin

  // border
  borderWidth?: Length | EdgeWidths
  borderLeftWidth?: Length
  borderRightWidth?: Length
  borderTopWidth?: Length
  borderBottomWidth?: Length
  borderColor?: ResourceColor | EdgeColors
  borderLeftColor?: ResourceColor
  borderRightColor?: ResourceColor
  borderTopColor?: ResourceColor
  borderBottomColor?: ResourceColor
  borderStyle?: BorderStyle | EdgeStyles
  borderLeftStyle?: BorderStyle
  borderRightStyle?: BorderStyle
  borderTopStyle?: BorderStyle
  borderBottomStyle?: BorderStyle
  borderRadius?: Length | BorderRadiuses
  borderTopLeftRadius?: Length
  borderTopRightRadius?: Length
  borderBottomLeftRadius?: Length
  borderBottomRightRadius?: Length

  // text
  color?: ResourceColor
  fontSize?: number | string | Resource
  fontStyle?: FontStyle
  fontWeight?: number | FontWeight | string
  fontFamily?: string | Resource
  lineHeight?: string | number | Resource
  textDecoration?: TextDecorationType

  // gradient
  linearGradient?: HarmonyType.LinearGradient

  // other
  opacity?: number | Resource
  zIndex?: number
  overflow?: boolean
  focus?: boolean
}

export interface TaroTextStyleType {
  textAlign?: TextAlign
  textOverflow?: HarmonyType.Overflow
  WebkitLineClamp?: number
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
      colors?: Array<[ResourceColor, number]>
    }
    export type backgroundImageSize = SizeOptions | ImageSize
    export type backgroundImagePosition = Position | Alignment
  }
  export namespace Transform {
    export interface Origin {
      x?: number
      y?: number
    }
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

