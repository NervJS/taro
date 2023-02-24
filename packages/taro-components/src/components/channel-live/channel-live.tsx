import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-channel-live-core'
})
export class ChannelLive implements ComponentInterface {
  componentDidLoad () {
    notSupport('ChannelLive', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
