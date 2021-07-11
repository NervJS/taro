import webview from '@system.webview'

export function webviewLoadUrl (opts = {}) {
  return webview.loadUrl(opts)
}

export default {
  webviewLoadUrl
}
