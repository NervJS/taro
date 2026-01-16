import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-aweme-data-core'
})
export class AwemeData implements ComponentInterface {
  componentDidLoad () {
    notSupport('AwemeData', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
