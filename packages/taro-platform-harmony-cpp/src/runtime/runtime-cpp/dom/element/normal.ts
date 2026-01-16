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
  ViewProps,
} from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

interface FlowSectionProps extends StandardProps {
  column?: number
}

@Observed
export class TaroOtherElement extends TaroElement<ViewProps> {
  isETS = true

  public setAttribute(name: string, value: TaroAny): void {
    super.setAttribute(name, value)

    // Note: 使用 @ComponentV2 时，需要在 struct 将参数声明为 @Local 并在此更新
    if (this._instance) {
      const attrName = `attr${name.charAt(0).toUpperCase()}${name.slice(1)}`
      this._instance[attrName] = value
    }
  }
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
  controller: typeof SwiperController = new SwiperController()

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
  isETS = true

  constructor() {
    super('Progress')
  }
}

@Observed
export class TaroPageMetaElement extends TaroElement<PageMetaProps> {
  isETS = true

  constructor() {
    super('PageMeta')
  }
}

@Observed
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
