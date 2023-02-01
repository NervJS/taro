import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'taro-web-view-core',
  styleUrl: './style/index.scss'
})
export class WebView implements ComponentInterface {
  @Prop() src: string

  @Event({
    eventName: 'load'
  })
  onLoad: EventEmitter

  @Event({
    eventName: 'error'
  })
  onError: EventEmitter

  render () {
    const {
      src,
      onLoad,
      onError
    } = this
    return (
      <iframe
        class='taro-webview'
        onLoad={(e: Event) => {
          e.stopPropagation()
          onLoad.emit({ src })
        }}
        onError={(e: Event) => {
          e.stopPropagation()
          onError.emit({ src })
        }}
        src={src}
      />
    )
  }
}
