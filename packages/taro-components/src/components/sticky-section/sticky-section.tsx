import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-sticky-section-core'
})
export class StickySection implements ComponentInterface {
  componentDidLoad () {
    notSupport('StickySection', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
