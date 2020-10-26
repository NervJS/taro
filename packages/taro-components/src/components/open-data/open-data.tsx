// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-open-data-core'
})
export class OpenData {
  componentDidLoad () {
    console.error('H5 暂不支持 OpenData 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
