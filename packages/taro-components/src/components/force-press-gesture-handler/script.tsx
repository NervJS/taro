import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-force-press-gesture-handler-core'
})
export class ForcePressGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('ForcePressGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
