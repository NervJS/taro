import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-ad-custom-core'
})
export class AdCustom implements ComponentInterface {
  componentDidLoad () {
    notSupport('AdCustom', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
