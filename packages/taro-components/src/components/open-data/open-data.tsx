import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-open-data-core'
})
export class OpenData implements ComponentInterface {
  componentDidLoad () {
    notSupport('OpenData', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
