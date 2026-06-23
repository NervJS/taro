import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-double-tap-gesture-handler-core'
})
export class DoubleTapGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('DoubleTapGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
