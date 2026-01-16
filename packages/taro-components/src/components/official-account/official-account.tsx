import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-official-account-core'
})
export class OfficialAccount implements ComponentInterface {
  componentDidLoad () {
    notSupport('OfficialAccount', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
