
import { TaroElement } from './element'
import type { TaroAny } from '@tarojs/runtime'
import type { ProgressProps } from '@tarojs/components/types'

export function isTaroProgressElement (item: TaroAny): item is TaroProgressElement{
  return item?.tagName === "PROGRESS"
}
 
 @Observed
export class TaroProgressElement extends TaroElement<ProgressProps> {
  constructor() {
    super('Progress')
  }
}
