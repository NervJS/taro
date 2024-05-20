import { TaroElement } from './element'
import type { TaroAny } from '@tarojs/runtime'
import type { TextProps } from '@tarojs/components/types'

export function isTaroTextElement (item: TaroAny): item is TaroTextElement {
  return item?.tagName === "TEXT"
}
 
 @Observed
export class TaroTextElement extends TaroElement<TextProps> {
  constructor() {
    super('Text')
  }
}
