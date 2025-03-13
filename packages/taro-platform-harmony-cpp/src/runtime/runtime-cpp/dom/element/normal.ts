
import { TaroElement } from './element'
import { TaroScrollViewElement } from './scroll_view'

import type {
  ButtonProps,
  IconProps,
  ImageProps,
  NavigationBarProps,
  PageMetaProps,
  ProgressProps,
  StandardProps,
  SwiperItemProps,
  SwiperProps,
  ViewProps
} from '@tarojs/components/types'

interface FlowSectionProps extends StandardProps {
  column?: number
}

export class TaroOtherElement extends TaroElement<ViewProps> {
  isETS = true
}

export class TaroViewElement extends TaroElement<ViewProps> {
  constructor() {
    super('View')
  }
}

export class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

export class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}

export class TaroIconElement extends TaroElement<IconProps> {
  constructor() {
    super('Icon')
  }
}

export class TaroSwiperElement extends TaroElement<SwiperProps> {
  constructor() {
    super('Swiper')
  }
}

export class TaroSwiperItemElement extends TaroElement<SwiperItemProps> {
  constructor() {
    super('SwiperItem')
  }
}

export class TaroProgressElement extends TaroElement<ProgressProps> {
  constructor() {
    super('Progress')
  }
}

export class TaroPageMetaElement extends TaroElement<PageMetaProps> {
  isETS = true

  constructor() {
    super('PageMeta')
  }
}

export class TaroNavigationBarElement extends TaroElement<NavigationBarProps> {
  isETS = true

  constructor() {
    super('NavigationBar')
  }
}

export class TaroWaterFlowElement extends TaroScrollViewElement {
  constructor() {
    super('WaterFlow')
  }
}

export class TaroListElement extends TaroScrollViewElement {
  constructor() {
    super('List')
  }
}

export class TaroFlowSectionElement extends TaroElement<FlowSectionProps> {
  constructor() {
    super('FlowSection')
  }
}

export class TaroFlowItemElement extends TaroElement {
  constructor() {
    super('FlowItem')
  }
}
