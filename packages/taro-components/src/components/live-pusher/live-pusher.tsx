import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-live-pusher-core'
})
export class LivePusher implements ComponentInterface {
  componentDidLoad () {
    notSupport('LivePusher', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
