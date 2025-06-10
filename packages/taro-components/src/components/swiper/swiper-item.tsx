import { Component, ComponentInterface, Host, h, Element, Prop } from '@stencil/core'

import { handleStencilNodes } from '../../utils'
import classNames from 'classnames'

@Component({
  tag: 'taro-swiper-item-core'
})
export class SwiperItem implements ComponentInterface {
  @Element() el: HTMLElement
  @Prop() itemId: string

  //Note: 由于 swiper.js 会通过子元素中的 class 来判断是否为 swiper-slide，所以这里需要在 connectedCallback 中添加 swiper-slide 类名
  connectedCallback() {
    this.el.className = classNames(this.el.className, 'swiper-slide')
  }

  componentDidRender () {
    handleStencilNodes(this.el)
  }

  render () {
    return (
      <Host item-id={this.itemId}>
        <slot></slot>
      </Host>
    )
  }
}
