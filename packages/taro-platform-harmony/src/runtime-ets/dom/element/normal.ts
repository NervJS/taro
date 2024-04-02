
import { TaroElement } from './element'

import type {
  ButtonProps,
  IconProps,
  ImageProps,
  LabelProps,
  RichTextProps,
  SwiperItemProps,
  SwiperProps,
  ViewProps
} from '@tarojs/components/types'

@Observed
class TaroOtherElement extends TaroElement<ViewProps> {}

@Observed
class TaroViewElement extends TaroElement<ViewProps> {
  constructor() {
    super('View')
  }
}

@Observed
class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

@Observed
class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}

@Observed
class TaroIconElement extends TaroElement<IconProps>{
  constructor() {
    super('Icon')
  }
}
@Observed
class TaroLabelElement extends TaroElement<LabelProps>{
  constructor() {
    super('Label')
  }
}

@Observed
class TaroRichTextElement extends TaroElement<RichTextProps>{
  constructor() {
    super('RichText')
  }
}

@Observed
class TaroSwiperElement extends TaroElement<SwiperProps>{
  controller: SwiperController = new SwiperController()

  constructor() {
    super('Swiper')
  }
}

@Observed
class TaroSwiperItemElement extends TaroElement<SwiperItemProps>{
  constructor() {
    super('SwiperItem')
  }
}

// Fixed浮层节点树
@Observed
class FixedLayer extends TaroElement {
  constructor() {
    super('View')
  }
}

export {
  FixedLayer,
  TaroButtonElement,
  TaroIconElement,
  TaroImageElement,
  TaroLabelElement,
  TaroOtherElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroViewElement
}
