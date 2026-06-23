import { Component, h, Host, ComponentInterface } from '@stencil/core'

@Component({
  tag: 'taro-block-core'
})
export class Block implements ComponentInterface {
  render () {
    return (
      <Host />
    )
  }
}
