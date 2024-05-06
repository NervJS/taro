import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-grid-builder-core'
})
export class GridBuilder implements ComponentInterface {
  componentDidLoad () {
    notSupport('GridBuilder', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
