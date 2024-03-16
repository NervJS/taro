import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-ar-camera-core'
})
export class ArCamera implements ComponentInterface {
  componentDidLoad () {
    notSupport('ArCamera', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
