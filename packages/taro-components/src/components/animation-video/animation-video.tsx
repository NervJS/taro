import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-animation-video-core'
})
export class AnimationVideo implements ComponentInterface {
  componentDidLoad () {
    notSupport('AnimationVideo', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
