import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-tap-gesture-handler-core'
})
export class TapGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('TapGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
