import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-rtc-room-core'
})
export class RtcRoom implements ComponentInterface {
  componentDidLoad () {
    notSupport('RtcRoom', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
