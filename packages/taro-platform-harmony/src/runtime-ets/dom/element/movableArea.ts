
import { TaroElement } from './element'
// import type { TaroAny } from '@tarojs/runtime'

import type { MovableAreaProps } from '@tarojs/components/types'

export function isTaroMovableAreaElement (item: TaroAny): item is TaroMovableAreaElement {
  return item?.tagName === "MOVABLE-AREA"
}
 
 @Observed
export class TaroMovableAreaElement extends TaroElement<MovableAreaProps> {
  constructor() {
    super('MovableArea')
  }
}
