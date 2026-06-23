import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-nested-scroll-header-core'
})
export class NestedScrollHeader implements ComponentInterface {
  componentDidLoad () {
    notSupport('NestedScrollHeader', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
