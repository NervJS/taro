import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-script-core'
})
export class Script implements ComponentInterface {
  componentDidLoad () {
    notSupport('Script', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
