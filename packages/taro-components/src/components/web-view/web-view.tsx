import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'

const hasWindow = typeof window !== 'undefined' && typeof window.addEventListener === 'function'

type WebViewInstance = WebView

const webViewInstances = new Set<WebViewInstance>()

let messageListenerAttached = false

function handleWindowMessage (event: MessageEvent) {
  webViewInstances.forEach(instance => {
    instance.handleMessage(event)
  })
}

function attachGlobalMessageListener () {
  if (!hasWindow || messageListenerAttached) return
  window.addEventListener('message', handleWindowMessage)
  messageListenerAttached = true
}

function detachGlobalMessageListenerIfNeeded () {
  if (!hasWindow || !messageListenerAttached) return
  if (webViewInstances.size > 0) return
  window.removeEventListener('message', handleWindowMessage)
  messageListenerAttached = false
}

@Component({
  tag: 'taro-web-view-core',
  styleUrl: './style/index.scss'
})
export class WebView implements ComponentInterface {
  private iframe?: HTMLIFrameElement

  @Prop() src: string

  @Event({
    eventName: 'load'
  })
  onLoad: EventEmitter

  @Event({
    eventName: 'error'
  })
  onError: EventEmitter

  @Event({
    eventName: 'message'
  })
  onMessage: EventEmitter

  componentDidLoad () {
    webViewInstances.add(this)
    attachGlobalMessageListener()
  }

  disconnectedCallback () {
    webViewInstances.delete(this)
    detachGlobalMessageListenerIfNeeded()
  }

  handleMessage (event: MessageEvent) {
    const iframeWindow = this.iframe?.contentWindow
    if (!iframeWindow || event.source !== iframeWindow) return

    const {
      src,
      onMessage
    } = this

    if (!onMessage) return

    onMessage.emit({
      data: event.data,
      origin: event.origin,
      src
    })
  }

  render () {
    const {
      src,
      onLoad,
      onError
    } = this
    return (
      <iframe
        ref={el => {
          this.iframe = el as HTMLIFrameElement
        }}
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
