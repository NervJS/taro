import { TaroElement } from './element'

import type { ScrollViewProps } from '@tarojs/components/types'

export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  constructor(tagName = 'ScrollView') {
    super(tagName)
  }

  get scrollTop() {
    return nativeOtherManager.getCurrentOffset(this)?.yOffset
  }

  set scrollTop(value: number) {
    nativeOtherManager.scrollTo(this, {
      yOffset: value,
      duration: 0
    })
  }

  get scrollLeft() {
    return nativeOtherManager.getCurrentOffset(this)?.xOffset
  }

  set scrollLeft(value: number) {
    nativeOtherManager.scrollTo(this, {
      xOffset: value,
      duration: 0
    })
  }
}
