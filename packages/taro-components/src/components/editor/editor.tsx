import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-editor-core'
})
export class Editor implements ComponentInterface {
  componentDidLoad () {
    notSupport('Editor', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
