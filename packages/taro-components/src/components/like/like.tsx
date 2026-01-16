import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-like-core'
})
export class Like implements ComponentInterface {
  componentDidLoad () {
    notSupport('Like', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
