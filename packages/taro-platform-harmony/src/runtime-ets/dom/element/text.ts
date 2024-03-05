import { TaroNode } from '../node'
import { TaroElement } from './element'

import type { TextProps } from '@tarojs/components/types'

@Observed
export class TaroTextElement extends TaroElement<TextProps> {
  constructor() {
    super('Text')
  }

  public appendChild (child: TaroNode): TaroNode {
    super.appendChild(child)

    this.updateComponent()
    return child
  }
}
