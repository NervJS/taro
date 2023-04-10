/**
 * ✔ src
 * ✔ onMessage(bindmessage)
 * ✔ onLoad(bindload)
 * ✔ onError(binderror)
 *
 * 注意：onMessage 每次调用都会执行（小程序在特定时机触发），RN WebView 调用 window.postMessage 只接收一个字符串参数
 */

import * as React from 'react'
import {
  WebView
} from 'react-native-webview'
import { WebViewProps } from './PropsType'
import { noop } from '../../utils'

const _WebView: React.FC<WebViewProps> = ({
  style,
  src,
  onMessage = noop,
  onLoad = noop,
  onError = noop,
}: WebViewProps) => {
  return (
    <WebView
      source={{ uri: src }}
      onMessage={(event) => {
        onMessage({
          detail: {
            data: [event.nativeEvent.data]
          }
        })
      }}
      onLoad={() => {
        onLoad({
          detail: { src }
        })
      }}
      onError={() => {
        onError({
          detail: { src }
        })
      }}
      style={style as Record<string, unknown>}
    />
  )
}

_WebView.displayName = '_WebView'

export default _WebView
