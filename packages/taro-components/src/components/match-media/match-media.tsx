// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-match-media-core'
})
export class MatchMedia {
  componentDidLoad () {
    console.error('H5 暂不支持 MatchMedia 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
