// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, ComponentInterface } from '@stencil/core'

@Component({
  tag: 'taro-block'
})
export class Block implements ComponentInterface {
  render () {
    return (
      <Host />
    )
  }
}
