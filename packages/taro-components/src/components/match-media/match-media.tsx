import { Component, ComponentInterface, h, Host } from '@stencil/core'

import { notSupport } from '../../utils'

@Component({
  tag: 'taro-match-media-core'
})
export class MatchMedia implements ComponentInterface {
  componentDidLoad () {
    notSupport('MatchMedia', this)
  }

  render () {
    return (
      <Host />
    )
  }
}
