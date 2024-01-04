import web_webview from '@ohos.web.webview'

import { TaroElement } from './element'

import type { WebViewProps } from '@tarojs/components/types'

export class TaroWebViewElement extends TaroElement<WebViewProps>{
  controller: web_webview.WebviewController = new web_webview.WebviewController()

  constructor() {
    super('WebView')
  }
}
