import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-lottie-core'
})
export class Lottie implements ComponentInterface {
  componentDidLoad () {
    notSupport('Lottie', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
