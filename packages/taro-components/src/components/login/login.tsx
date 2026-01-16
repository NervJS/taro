import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-login-core'
})
export class Login implements ComponentInterface {
  componentDidLoad () {
    notSupport('Login', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
