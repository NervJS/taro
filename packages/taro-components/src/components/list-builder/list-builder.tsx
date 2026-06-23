import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-list-builder-core'
})
export class ListBuilder implements ComponentInterface {
  componentDidLoad () {
    notSupport('ListBuilder', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
