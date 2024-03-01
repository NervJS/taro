import htmlParser from './utils/htmlParser'
import { createChildItem } from './render'

import type { TaroElement } from '@tarojs/runtime'

@Component
export default struct TaroInnerHtml {
  @ObjectLink node: TaroElement
  build() {
    if (this.node.innerHTML) {
      createChildItem(htmlParser(this.node.innerHTML))
    }
  }
}
