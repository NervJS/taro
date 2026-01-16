
import { TaroElement } from './element'

import type { ProgressProps } from '@tarojs/components/types'

@Observed
export class TaroProgressElement extends TaroElement<ProgressProps> {
  constructor() {
    super('Progress')
  }
}
