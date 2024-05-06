import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-draggable-sheet-core'
})
export class DraggableSheet implements ComponentInterface {
  componentDidLoad () {
    notSupport('DraggableSheet', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
