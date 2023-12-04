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

export namespace CompType {
  export namespace ScrollView {
    export interface Attrs {
      scrollBar: BarState
    }
    export interface CurrentOffset {
      xOffset: number
      yOffset: number
    }
    export interface ScrollEvent {
      deltaX: number
      deltaY: number
      scrollLeft: number
      scrollTop: number
      scrollWidth: number
      scrollHeight: number
    }
  }
  export namespace Slider {
    export interface Options {
      min?: number
      max?: number
      value?: number
      step?: number
      style?: SliderStyle
      direction?: Axis
    }
    export interface Attrs {
      selectedColor?: ResourceColor
      trackColor?: ResourceColor
      trackThickness?: Length
      blockColor?: ResourceColor
    }
    export interface Params {
      width: string
    }
  }
  export namespace Input {
    export class Attrs {
      textAlign?: TextAlign
    }
  }
  export namespace Text {
    export interface Attrs {
      textAlign?: TextAlign
      textOverflow?: HarmonyType.Overflow
      maxLines?: number
      letterSpacing?: number | string
    }
  }
  export namespace Checkbox {
    export interface Options {
      name: string
      group: string
    }
    export interface Attrs {
      selectedColor?: ResourceColor
    }
  }
  export namespace Radio {
    export interface Options {
      group: string
      value: string
    }
    export interface Attrs {
      radioStyle?: HarmonyType.RadioStyle
      themeStyles?: boolean
    }
  }
  export namespace Switch {
    export interface Attrs {
      selectedColor?: ResourceColor
    }
  }
  export namespace Swiper {
    export interface Attrs {
      index?: number
      loop?: boolean
      duration?: number
      interval?: number
      vertical?: boolean
      autoPlay?: boolean
      indicator?: boolean
    }
  }
  export namespace Video {
    export interface Options {
      src?: string | Resource
      previewUri?: string |PixelMap | Resource
      controller?: VideoController
    }
    export interface Attrs {
      muted?: boolean
      controls?: boolean
      autoPlay?: boolean
      loop?: boolean
      objectFit?: ImageFit
    }
    export interface UpdateEvent {
      time: number
    }
  }
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