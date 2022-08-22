// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-editor-core'
})
export class Editor {
  componentDidLoad () {
    console.error('H5 暂不支持 Editor 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
