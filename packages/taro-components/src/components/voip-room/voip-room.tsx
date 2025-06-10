import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-voip-room-core'
})
export class VoipRoom implements ComponentInterface {
  componentDidLoad () {
    notSupport('VoipRoom', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
