
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
class TaroViewElement extends TaroElement<ViewProps> {
  constructor() {
    super('View')
  }
}

class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}


class TaroIconElement extends TaroElement<IconProps>{
  constructor() {
    super('Icon')
  }
}

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


export {
  TaroButtonElement,
  TaroIconElement,
  TaroImageElement,
  TaroLabelElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroViewElement, 
}
