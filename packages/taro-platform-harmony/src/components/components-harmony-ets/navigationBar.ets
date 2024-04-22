import { isTagFirstChild } from './utils/helper'

import type { TaroNavigationBarElement } from '@tarojs/runtime'

@Component
export default struct TaroNavigationBar {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroNavigationBarElement) => void = this.customBuilder
  @ObjectLink node: TaroNavigationBarElement

  aboutToAppear(): void {
    if (!isTagFirstChild(this.node, 'page-meta')) {
      console.error('NavigationBar 只能是 PageMeta 内的第一个节点。')
    }
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    if (true) {
      this.createLazyChildren(this.node)
    }
  }
}
