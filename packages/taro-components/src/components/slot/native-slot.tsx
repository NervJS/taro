import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-native-slot-core'
})
export class NativeSlot implements ComponentInterface {
  componentDidLoad () {
    notSupport('NativeSlot', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
