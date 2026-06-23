import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-nested-scroll-body-core'
})
export class NestedScrollBody implements ComponentInterface {
  componentDidLoad () {
    notSupport('NestedScrollBody', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
