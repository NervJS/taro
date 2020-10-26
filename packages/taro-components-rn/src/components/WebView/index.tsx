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
} from 'react-native'
import { WebViewProps } from './PropsType'
import utils from '../../utils'

const _WebView: React.SFC<WebViewProps> = ({
  style,
  src,
  onMessage = utils.noop,
  onLoad = utils.noop,
  onError = utils.noop,
}) => {
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
      style={style}
    />
  )
}

_WebView.displayName = '_WebView'

export default _WebView
