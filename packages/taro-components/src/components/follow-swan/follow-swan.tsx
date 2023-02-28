import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-follow-swan-core'
})
export class FollowSwan implements ComponentInterface {
  componentDidLoad () {
    notSupport('FollowSwan', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
