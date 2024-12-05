import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-horizontal-drag-gesture-handler-core'
})
export class HorizontalDragGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('HorizontalDragGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
