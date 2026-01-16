import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-inline-payment-panel-core'
})
export class InlinePaymentPanel implements ComponentInterface {
  componentDidLoad () {
    notSupport('InlinePaymentPanel', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
