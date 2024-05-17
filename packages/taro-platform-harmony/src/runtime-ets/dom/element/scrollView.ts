import { bindScrollTo } from '../bind'
import { TaroElement } from './element'
import type { TaroAny } from '@tarojs/runtime'
import type { ScrollViewProps } from '@tarojs/components/types'

export function isTaroScrollViewElement (item: TaroAny): item is TaroScrollViewElement{
  return item?.tagName === "SCROLL-VIEW"
}
 
 @Observed
export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  scroller: Scroller = new Scroller()

  constructor() {
    super('ScrollView')

    bindScrollTo(this)
  }
}
