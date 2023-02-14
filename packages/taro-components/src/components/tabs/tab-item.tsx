import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-tab-item-core'
})
export class TabItem implements ComponentInterface {
  componentDidLoad () {
    notSupport('TabItem', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
