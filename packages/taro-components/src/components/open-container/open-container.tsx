import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-open-container-core'
})
export class OpenContainer implements ComponentInterface {
  componentDidLoad () {
    notSupport('OpenContainer', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
