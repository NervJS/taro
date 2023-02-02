import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-contact-button-core'
})
export class ContactButton implements ComponentInterface {
  componentDidLoad () {
    notSupport('ContactButton', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
