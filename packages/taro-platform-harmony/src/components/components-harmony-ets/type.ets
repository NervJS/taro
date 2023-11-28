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
  fontColor?: ResourceColor
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
    export class Attrs {
      scrollBar: BarState
    }
    export class CurrentOffset {
      xOffset: number
      yOffset: number
    }
    export class ScrollEvent {
      deltaX: number
      deltaY: number
      scrollLeft: number
      scrollTop: number
      scrollWidth: number
      scrollHeight: number
    }
  }
  export namespace Slider {
    export class Options {
      min?: number
      max?: number
      value?: number
      step?: number
      style?: SliderStyle
      direction?: Axis
    }
    export class Attrs {
      selectedColor?: ResourceColor
      trackColor?: ResourceColor
      trackThickness?: Length
      blockColor?: ResourceColor
    }
    export class Params {
      width: string
    }
  }
  export namespace Input {
    export class Attrs {
      textAlign?: TextAlign
    }
  }
  export namespace Text {
    export class Attrs {
      textAlign?: TextAlign
      textOverflow?: HarmonyType.Overflow
      maxLines?: number
      letterSpacing?: number | string
    }
  }
  export namespace Checkbox {
    export class Options {
      name: string
      group: string
    }
    export class Attrs {
      selectedColor?: ResourceColor
    }
  }
  export namespace Radio {
    export class Options {
      group: string
      value: string
    }
    export class Attrs {
      radioStyle?: HarmonyType.RadioStyle
      themeStyles?: boolean
    }
  }
  export namespace Switch {
    export class Attrs {
      selectedColor?: ResourceColor
    }
  }
  export namespace Swiper {
    export class Attrs {
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
    export class Options {
      src?: string | Resource
      previewUri?: string |PixelMap | Resource
      controller?: VideoController
    }
    export class Attrs {
      muted?: boolean
      controls?: boolean
      autoPlay?: boolean
      loop?: boolean
      objectFit?: ImageFit
    }
    export class UpdateEvent {
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
  export class LinearGradient {
    angle?: number | string
    direction?: GradientDirection
    colors: Array<[ResourceColor, number]>
    repeating?: boolean
  }
  export class Overflow {
    overflow: TextOverflow;
  }
  export class RadioStyle {
    checkedBackgroundColor?: ResourceColor
    uncheckedBorderColor?: ResourceColor
    indicatorColor?: ResourceColor
  }
  export namespace Background {
    export type backgroundColor = ResourceColor
    export class backgroundImage {
      src: ResourceStr
      repeat?: ImageRepeat
    }
    export type backgroundImageSize = SizeOptions | ImageSize
    export type backgroundImagePosition = Position | Alignment
  }
  export namespace Transform {
    export class Rotate {
      x?: number
      y?: number
      z?: number
      angle: number | string
      centerX?: number | string
      centerY?: number | string
      center?: number
      perspective?: number
    }
    export class Translate {
      x?: number | string
      y?: number | string
      z? : number | string
    }
    export class Scale {
      x?: number
      y?: number
      z?: number
      centerX?: number | string
      centerY?: number | string
    }
    export type Transform = matrix4.Matrix4Transit
  }

}