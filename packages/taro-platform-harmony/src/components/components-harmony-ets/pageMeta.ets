import { APP, eventCenter } from '@tarojs/runtime/dist/runtime.esm'

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

    eventCenter.on('__taroComponentAttributeUpdate', this.handleAttributeUpdate.bind(this))
    this.handleAttributes(this.node._attrs)
  }

  aboutToDisappear(): void {
    eventCenter.off('__taroComponentAttributeUpdate', this.handleAttributeUpdate.bind(this))
  }

  handleAttributeUpdate (opt: IComponentAttributeUpdateEvents) {
    if (opt.id === this.node._nid && opt.tagName === 'PAGE-META') {
      const attrs: Record<string, TaroAny> = {}
      attrs[opt.attribute] = opt.value
      this.handleAttributes(attrs)
    }
  }

  handleAttributes (attrs: Record<string, TaroAny>) {
    const options: Record<string, TaroAny> = {}

    // FIXME 更新类型支持度
    if (attrs.backgroundColorTop || options.backgroundColor) {
      options.backgroundColorContext = attrs.backgroundColorTop || options.backgroundColor
    }
    if (attrs.backgroundColorBottom || options.backgroundColor) {
      options.backgroundColor = attrs.backgroundColorBottom || options.backgroundColor
    }
    if (attrs.backgroundTextStyle) {
      options.backgroundTextStyle = attrs.backgroundTextStyle
    }

    // if (attrs.scrollTop || attrs.scrollDuration) {
    //   pageScrollTo({
    //     scrollTop: attrs.scrollTop || this.node._attrs.scrollTop,
    //     duration: attrs.scrollDuration || this.node._attrs.scrollDuration,
    //   })
    // }
    // pageStyle
    if (attrs.rootBackgroundColor) {
      options.backgroundColor = attrs.rootBackgroundColor
    }
    // rootFontSize
    // pageFontSize
    // pageOrientation
    eventCenter.trigger('__taroPageStyle', options)
    // onResize
    // onScroll
    // onScrollDone
  }

  build() {
    if (true) {
      this.createLazyChildren(this.node)
    }
  }
}
