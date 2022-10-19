import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-navigation-bar-core'
})
export class NavigationBar implements ComponentInterface {
  componentDidLoad () {
    notSupport('NavigationBar', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
