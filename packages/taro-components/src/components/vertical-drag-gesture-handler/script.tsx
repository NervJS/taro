import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-vertical-drag-gesture-handler-core'
})
export class VerticalDragGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('VerticalDragGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
