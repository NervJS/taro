import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-tabs-core'
})
export class Tabs implements ComponentInterface {
  componentDidLoad () {
    notSupport('Tabs', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
