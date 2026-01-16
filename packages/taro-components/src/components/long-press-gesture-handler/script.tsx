import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-long-press-gesture-handler-core'
})
export class LongPressGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('LongPressGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
