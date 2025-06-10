import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-page-container-core'
})
export class PageContainer implements ComponentInterface {
  componentDidLoad () {
    notSupport('PageContainer', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
