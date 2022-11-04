import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-camera-core'
})
export class Camera implements ComponentInterface {
  componentDidLoad () {
    notSupport('Camera', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
