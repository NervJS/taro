import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

import { isTagFirstChild } from './utils/helper'

import type { TaroAny, TaroNavigationBarElement } from '@tarojs/runtime'
import type { IComponentAttributeUpdateEvents } from './pageMeta'

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

    eventCenter.on('__taroComponentAttributeUpdate', this.handleAttributeUpdate)
    this.handleAttributes(this.node._attrs)
  }

  aboutToDisappear(): void {
    eventCenter.off('__taroComponentAttributeUpdate', this.handleAttributeUpdate)
  }

  handleAttributeUpdate = (opt: IComponentAttributeUpdateEvents) => {
    if (opt.id === this.node._nid && opt.tagName === 'NAVIGATION-BAR') {
      const attrs: Record<string, TaroAny> = {}
      attrs[opt.attribute] = opt.value
      this.handleAttributes(attrs)
    }
  }

  handleAttributes (attrs: Record<string, TaroAny>) {
    const options: Record<string, TaroAny> = {}

    if (attrs.title) {
      options.title = attrs.title
    }
    if (attrs.loading) {
      options.loading = attrs.loading
    }
    if (attrs.backgroundColor) {
      options.backgroundColor = attrs.backgroundColor
    }
    if (attrs.frontColor) {
      options.frontColor = attrs.frontColor
    }
    eventCenter.trigger('__taroNavigationStyle', options)
    // FIXME: 以下属性暂时不支持
    // attrs.colorAnimationDuration
    // attrs.colorAnimationTimingFunc
  }

  build() {
    if (true) {
      this.createLazyChildren(this.node)
    }
  }
}
