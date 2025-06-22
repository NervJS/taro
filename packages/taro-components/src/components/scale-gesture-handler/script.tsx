import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-scale-gesture-handler-core'
})
export class ScaleGestureHandler implements ComponentInterface {
  componentDidLoad () {
    notSupport('ScaleGestureHandler', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
