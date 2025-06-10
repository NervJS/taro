import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-ad-core'
})
export class Ad implements ComponentInterface {
  componentDidLoad () {
    notSupport('Ad', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
