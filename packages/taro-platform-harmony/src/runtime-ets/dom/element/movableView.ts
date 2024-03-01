
import { TaroElement } from './element'

import type { MovableViewProps } from '@tarojs/components/types'

@Observed
export class TaroMovableViewElement extends TaroElement<MovableViewProps & {'animation': undefined}> {

  constructor() {
    super('MovableView')
  }
}
