import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-lifestyle-core'
})
export class Lifestyle implements ComponentInterface {
  componentDidLoad () {
    notSupport('Lifestyle', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
