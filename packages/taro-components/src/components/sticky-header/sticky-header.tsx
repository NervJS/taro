import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-sticky-header-core'
})
export class StickyHeader implements ComponentInterface {
  componentDidLoad () {
    notSupport('StickyHeader', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
