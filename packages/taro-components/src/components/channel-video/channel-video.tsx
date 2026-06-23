import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-channel-video-core'
})
export class ChannelVideo implements ComponentInterface {
  componentDidLoad () {
    notSupport('ChannelVideo', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
