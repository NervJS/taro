import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-animation-view-core'
})
export class AnimationView implements ComponentInterface {
  componentDidLoad () {
    notSupport('AnimationView', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
