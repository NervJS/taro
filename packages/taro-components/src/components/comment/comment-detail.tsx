import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-comment-detail-core'
})
export class CommentDetail implements ComponentInterface {
  componentDidLoad () {
    notSupport('CommentDetail', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
