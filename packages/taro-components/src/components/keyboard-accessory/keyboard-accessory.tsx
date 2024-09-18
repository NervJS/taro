import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-keyboard-accessory-core'
})
export class KeyboardAccessory implements ComponentInterface {
  componentDidLoad () {
    notSupport('KeyboardAccessory', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
