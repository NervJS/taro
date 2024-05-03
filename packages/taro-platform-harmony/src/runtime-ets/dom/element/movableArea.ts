
import { TaroElement } from './element'

import type { MovableAreaProps } from '@tarojs/components/types'

@Observed
export class TaroMovableAreaElement extends TaroElement<MovableAreaProps> {
  constructor() {
    super('MovableArea')
  }
}
