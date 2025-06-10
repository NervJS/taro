import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-live-player-core'
})
export class LivePlayer implements ComponentInterface {
  componentDidLoad () {
    notSupport('LivePlayer', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
