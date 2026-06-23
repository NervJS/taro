import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-root-portal-core'
})
export class RootPortal implements ComponentInterface {
  componentDidLoad () {
    notSupport('RootPortal', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
