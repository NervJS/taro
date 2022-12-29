import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-slot-core'
})
export class Slot implements ComponentInterface {
  componentDidLoad () {
    notSupport('Slot', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
