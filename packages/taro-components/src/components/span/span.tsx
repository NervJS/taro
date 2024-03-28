import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-span-core',
})
export class Span implements ComponentInterface {
  componentDidLoad() {
    notSupport('Span', this)
  }

  render() {
    return <Host />
  }
}
