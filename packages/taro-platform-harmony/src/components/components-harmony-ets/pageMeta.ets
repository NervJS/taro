import { APP, eventCenter } from '@tarojs/runtime'
import { getCurrentInstance, pageScrollTo } from '@tarojs/taro'

import { isTagFirstChild } from './utils/helper'

import type { TaroAny, TaroPageMetaElement } from '@tarojs/runtime'

export interface IComponentAttributeUpdateEvents {
  id: string
  tagName: string
  attribute: string
  value: TaroAny
}

@Component
export default struct TaroPageMeta {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroPageMetaElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroPageMetaElement

  page: TaroAny = {}

  aboutToAppear(): void {
    if (!isTagFirstChild(this.node, APP, 2)) {
      // PageMeta 只能是页面内的第一个元素
      console.error('PageMeta 只能是页面内的第一个元素。')
    }

    this.page = getCurrentInstance().page
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
    if (opt.id === this.node._nid.toString() && opt.tagName === 'PAGE-META') {
      const attrs: Record<string, TaroAny> = {}
      attrs[opt.attribute] = opt.value
      this.handleAttributes(attrs)
    }
  }

  handleAttributes (attrs: Record<string, TaroAny>) {
    const options: Record<string, TaroAny> = {}
    let triggerStyleEvent = false

    // FIXME 更新类型支持度
    if (attrs.backgroundColorTop || attrs.rootBackgroundColor || attrs.backgroundColor) {
      options.backgroundColorContext = attrs.backgroundColorTop || attrs.rootBackgroundColor || attrs.backgroundColor
      triggerStyleEvent = true
    }
    if (attrs.backgroundColorBottom || attrs.backgroundColor) {
      options.backgroundColor = attrs.backgroundColorBottom || attrs.backgroundColor
      triggerStyleEvent = true
    }
    if (attrs.backgroundTextStyle) {
      options.backgroundTextStyle = attrs.backgroundTextStyle
      triggerStyleEvent = true
    }

    if (this.page === getCurrentInstance().page) {
      if (attrs.scrollTop || attrs.scrollDuration) {
        pageScrollTo({
          scrollTop: attrs.scrollTop || this.node._attrs.scrollTop,
          duration: attrs.scrollDuration || this.node._attrs.scrollDuration,
        } as TaroAny)
      }
    }
    // pageStyle
    // rootFontSize
    // pageFontSize
    // pageOrientation
    if (triggerStyleEvent) {
      eventCenter?.trigger('__taroPageStyle', options)
    }
    // onResize
    // onScroll
    // onScrollDone
  }

  build() {
    if (true) {
      this.createLazyChildren(this.node, 0)
    }
  }
}
