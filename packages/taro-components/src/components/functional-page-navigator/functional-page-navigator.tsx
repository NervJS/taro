import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-functional-page-navigator-core'
})
export class FunctionalPageNavigator implements ComponentInterface {
  componentDidLoad () {
    notSupport('FunctionalPageNavigator', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
