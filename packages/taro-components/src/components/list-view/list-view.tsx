import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-list-view-core'
})
export class ListView implements ComponentInterface {
  componentDidLoad () {
    notSupport('ListView', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
