import { bindScrollTo } from '../bind'
import { TaroElement } from './element'

import type { ScrollViewProps } from '@tarojs/components/types'

@Observed
export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  scroller: Scroller = new Scroller()

  constructor() {
    super('ScrollView')

    bindScrollTo(this)
  }
}
