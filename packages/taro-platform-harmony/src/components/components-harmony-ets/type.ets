import matrix4 from '@ohos.matrix4'

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

  // flex
  flexBasis?: number | string
  flexGrow?: number
  flexShrink?: number
  alignSelf?: ItemAlign
  direction?: FlexDirection
  justifyContent?: FlexAlign
  alignItems?: ItemAlign
  wrap?: FlexWrap
  alignContent?: FlexAlign;

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
    overflow: TextOverflow;
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
