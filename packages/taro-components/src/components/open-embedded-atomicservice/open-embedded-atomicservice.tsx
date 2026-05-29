import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-open-embedded-atomicservice-core'
})
export class OpenEmbeddedAtomicservice implements ComponentInterface {
  componentDidLoad () {
    notSupport('OpenEmbeddedAtomicservice', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
