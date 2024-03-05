import htmlParser from './utils/htmlParser'
import { createChildItem } from './render'

import type { TaroInnerHtmlElement } from '@tarojs/runtime'

@Component
export default struct TaroInnerHtml {
  @ObjectLink node: TaroInnerHtmlElement
  
  build() {
    if (this.node.innerHTML) {
      createChildItem(htmlParser(this.node.innerHTML))
    }
  }
}
