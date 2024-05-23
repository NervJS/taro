import { TaroElement } from './element'
import { TaroAny } from '@tarojs/runtime'

import type {
  ButtonProps,
  IconProps,
  ImageProps,
  LabelProps,
  NavigationBarProps,
  PageMetaProps,
  RichTextProps,
  SwiperItemProps,
  SwiperProps,
  ViewProps,
} from '@tarojs/components/types'

function isTaroOtherElement(item: TaroAny): item is TaroOtherElement {
  return item?.tagName === "OTHER"
}
 
 @Observed
class TaroOtherElement extends TaroElement<ViewProps> {}

function isTaroViewElement(item: TaroAny): item is TaroViewElement {
  return item?.tagName === "VIEW"
}
 
 @Observed
class TaroViewElement extends TaroElement<ViewProps> {
  constructor() {
    super('View')
  }
}

function isTaroImageElement(item: TaroAny): item is TaroImageElement {
  return item?.tagName === "IMAGE"
}
 
 @Observed
class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

function isTaroButtonElement(item: TaroAny): item is TaroButtonElement {
  return item?.tagName === "BUTTON"
}
 
 @Observed
class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}

function isTaroIconElement(item: TaroAny): item is TaroIconElement {
  return item?.tagName === "ICON"
}
 
 @Observed
class TaroIconElement extends TaroElement<IconProps> {
  constructor() {
    super('Icon')
  }
}
function isTaroLabelElement(item: TaroAny): item is TaroLabelElement {
  return item?.tagName === "LABEL"
}
 
 @Observed
class TaroLabelElement extends TaroElement<LabelProps> {
  constructor() {
    super('Label')
  }
}

function isTaroRichTextElement(item: TaroAny): item is TaroRichTextElement {
  return item?.tagName === "RICH-TEXT"
}
 
 @Observed
class TaroRichTextElement extends TaroElement<RichTextProps> {
  constructor() {
    super('RichText')
  }
}

function isTaroSwiperElement(item: TaroAny): item is TaroSwiperElement {
  return item?.tagName === "SWIPER"
}
 
 @Observed
class TaroSwiperElement extends TaroElement<SwiperProps> {
  controller: SwiperController = new SwiperController()

  constructor() {
    super('Swiper')
  }
}

function isTaroSwiperItemElement(item: TaroAny): item is TaroSwiperItemElement {
  return item?.tagName === "SWIPER-ITEM"
}
 
 @Observed
class TaroSwiperItemElement extends TaroElement<SwiperItemProps> {
  constructor() {
    super('SwiperItem')
  }
}

function isTaroPageMetaElement(item: TaroAny): item is TaroPageMetaElement {
  return item?.tagName === "PAGE-META"
}
 
 @Observed
class TaroPageMetaElement extends TaroElement<PageMetaProps> {
  constructor() {
    super('PageMeta')
  }
}

function isTaroNavigationBarElement(item: TaroAny): item is TaroNavigationBarElement {
  return item?.tagName === "NAVIGATION-BAR"
}
 
 @Observed
class TaroNavigationBarElement extends TaroElement<NavigationBarProps> {
  constructor() {
    super('NavigationBar')
  }
}

export {
  TaroButtonElement,
  TaroIconElement,
  TaroImageElement,
  TaroLabelElement,
  TaroNavigationBarElement,
  TaroOtherElement,
  TaroPageMetaElement,
  TaroRichTextElement,
  TaroSwiperElement,
  TaroSwiperItemElement,
  TaroViewElement,
}

export {
  isTaroOtherElement,
  isTaroViewElement,
  isTaroImageElement,
  isTaroButtonElement,
  isTaroIconElement,
  isTaroLabelElement,
  isTaroRichTextElement,
  isTaroSwiperElement,
  isTaroSwiperItemElement,
  isTaroPageMetaElement,
  isTaroNavigationBarElement,
}
