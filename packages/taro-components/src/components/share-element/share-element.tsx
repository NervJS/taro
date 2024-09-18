import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-share-element-core'
})
export class ShareElement implements ComponentInterface {
  componentDidLoad () {
    notSupport('ShareElement', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
