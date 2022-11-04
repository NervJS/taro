import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

@Component({
  tag: 'taro-swiper-item-core'
})
export class SwiperItem implements ComponentInterface {
  @Prop() itemId: string

  render () {
    return (
      <Host class='swiper-slide' item-id={this.itemId}/>
    )
  }
}
