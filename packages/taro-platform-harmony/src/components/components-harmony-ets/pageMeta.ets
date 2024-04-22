import { APP } from '@tarojs/runtime/dist/runtime.esm'

import { isTagFirstChild } from './utils/helper'

import type { TaroPageMetaElement } from '@tarojs/runtime'

@Component
export default struct TaroPageMeta {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroPageMetaElement) => void = this.customBuilder
  @ObjectLink node: TaroPageMetaElement

  aboutToAppear(): void {
    if (!isTagFirstChild(this.node, APP, 2)) {
      // PageMeta 只能是页面内的第一个元素
      console.error('PageMeta 只能是页面内的第一个元素。')
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
