import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-pan-gesture-handler-core'
})
export class PanGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('PanGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
