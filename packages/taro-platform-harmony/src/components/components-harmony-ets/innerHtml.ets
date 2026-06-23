import htmlParser from './utils/htmlParser'

import type { TaroElement, TaroInnerHtmlElement } from '@tarojs/runtime'

@Component
export default struct TaroInnerHtml {
  @Builder customBuilder() {}
  @BuilderParam createChildItem: (node: TaroElement, callback?: (node: TaroElement) => void) => void = this.customBuilder
  @ObjectLink node: TaroInnerHtmlElement

  build() {
    if (this.node?.hmStyle?.display !== 'none' && this.node.innerHTML) {
      this.createChildItem(htmlParser(this.node.innerHTML))
    }
  }
}
