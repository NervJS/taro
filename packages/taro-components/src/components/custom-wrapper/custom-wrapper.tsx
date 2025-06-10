import { Component, h, Host, ComponentInterface } from '@stencil/core'

@Component({
  tag: 'taro-custom-wrapper-core'
})
export class CustomWrapper implements ComponentInterface {
  render () {
    return (
      <Host />
    )
  }
}
