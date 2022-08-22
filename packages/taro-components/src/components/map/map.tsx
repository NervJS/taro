// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-map-core'
})
export class Map {
  componentDidLoad () {
    console.error('H5 暂不支持 Map 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
