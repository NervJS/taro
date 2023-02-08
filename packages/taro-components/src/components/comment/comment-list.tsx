import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-comment-list-core'
})
export class CommentList implements ComponentInterface {
  componentDidLoad () {
    notSupport('CommentList', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
