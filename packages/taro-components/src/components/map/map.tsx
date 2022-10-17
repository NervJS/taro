import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-map-core'
})
export class Map implements ComponentInterface {
  componentDidLoad () {
    notSupport('Map', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
