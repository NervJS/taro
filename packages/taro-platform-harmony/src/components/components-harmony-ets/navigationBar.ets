import { eventCenter } from '@tarojs/runtime'

import { isTagFirstChild } from './utils/helper'

import type { TaroAny, TaroNavigationBarElement } from '@tarojs/runtime'
import type { IComponentAttributeUpdateEvents } from './pageMeta'

@Component
export default struct TaroNavigationBar {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroNavigationBarElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroNavigationBarElement

  aboutToAppear(): void {
    if (!isTagFirstChild(this.node, 'page-meta')) {
      console.error('NavigationBar 只能是 PageMeta 内的第一个节点。')
    }
    if (this.node) {
      this.node._instance = this
    }

    // FIXME 在 Harmony 提供 @Watch 文档后，根据 node 实际使用更细粒度的监听
    eventCenter?.on('__taroComponentAttributeUpdate', this.handleAttributeUpdate)
    this.handleAttributes(this.node._attrs)
  }

  aboutToDisappear(): void {
    eventCenter?.off('__taroComponentAttributeUpdate', this.handleAttributeUpdate)
  }

  handleAttributeUpdate = (opt: IComponentAttributeUpdateEvents) => {
    if (opt.id === this.node._nid.toString() && opt.tagName === 'NAVIGATION-BAR') {
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
    eventCenter?.trigger('__taroNavigationStyle', options)
    // FIXME: 以下属性暂时不支持
    // attrs.colorAnimationDuration
    // attrs.colorAnimationTimingFunc
  }

  build() {
    if (true) {
      this.createLazyChildren(this.node, 0)
    }
  }
}
