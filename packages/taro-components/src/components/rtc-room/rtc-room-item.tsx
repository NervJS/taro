import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-rtc-room-item-core'
})
export class RtcRoomItem implements ComponentInterface {
  componentDidLoad () {
    notSupport('RtcRoomItem', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
