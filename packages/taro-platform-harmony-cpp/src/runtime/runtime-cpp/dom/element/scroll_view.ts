import { TaroNativeModule } from '../../harmony-library'
import { TaroElement } from './element'

import type { ScrollViewProps } from '@tarojs/components/types'

export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  constructor(tagName = 'ScrollView') {
    super(tagName)
  }

  get scrollTop() {
    return TaroNativeModule.getCurrentOffset(this)?.yOffset
  }

  set scrollTop(value: number) {
    TaroNativeModule.scrollTo(this, {
      yOffset: value,
      duration: 0
    })
  }

  get scrollLeft() {
    return TaroNativeModule.getCurrentOffset(this)?.xOffset
  }

  set scrollLeft(value: number) {
    TaroNativeModule.scrollTo(this, {
      xOffset: value,
      duration: 0
    })
  }
}
