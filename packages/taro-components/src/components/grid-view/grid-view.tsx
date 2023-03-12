import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-grid-view-core'
})
export class GridView implements ComponentInterface {
  componentDidLoad () {
    notSupport('GridView', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
