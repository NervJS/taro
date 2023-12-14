import htmlParser from './utils/htmlParser'
import { createChildItemWithPosition } from './render'

import type { TaroElement } from '@tarojs/runtime'

@Builder
export default function TaroInnerHtml (node: TaroElement) {
  if (node.innerHTML) {
    createChildItemWithPosition(htmlParser(node.innerHTML))
  }
}
