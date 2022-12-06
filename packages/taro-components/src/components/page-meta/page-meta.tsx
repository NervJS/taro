import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-page-meta-core'
})
export class PageMeta implements ComponentInterface {
  componentDidLoad () {
    notSupport('PageMeta', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
