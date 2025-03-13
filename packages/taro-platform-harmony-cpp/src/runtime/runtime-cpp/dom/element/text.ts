import { TaroElement } from './element'

import type { TextProps } from '@tarojs/components/types'

export class TaroTextElement extends TaroElement<TextProps> {
  constructor() {
    super('Text')
  }
}
