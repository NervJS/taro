import { bindScrollTo } from '../bind'
import { TaroElement } from './element'

import type { ScrollViewProps } from '../../../components/types'

export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  _wrapper?: Area
  
  scroller: Scroller = new Scroller()

  constructor() {
    super('ScrollView')

    bindScrollTo(this)
  }
}
