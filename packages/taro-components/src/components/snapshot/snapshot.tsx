import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-snapshot-core',
})
export class Snapshot implements ComponentInterface {
  componentDidLoad() {
    notSupport('Snapshot', this)
  }

  render() {
    return <Host />
  }
}
