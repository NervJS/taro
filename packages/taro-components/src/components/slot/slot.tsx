import { Component, ComponentInterface, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-slot-core'
})
export class Slot implements ComponentInterface {
  render () {
    return (
      <Host />
    )
  }
}
