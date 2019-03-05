/**
 * ✔ src
 * ✔ onMessage(bindmessage)
 * ✔ onLoad(bindload)
 * ✔ onError(binderror)
 *
 * 注意：onMessage 每次调用都会执行（小程序在特定时机触发），RN WebView 调用 window.postMessage 只接收一个字符串参数
 *
 * @flow
 */

import * as React from 'react'
import {
  WebView,
  StyleSheet,
} from 'react-native'
const utils = require('../../utils')

type Props = {
  style?: StyleSheet.Styles,
  src?: boolean,
  onMessage?: Function,
  onLoad?: Function,
  onError?: Function,
}

export default function _WebView ({
  style,
  src,
  onMessage = utils.noop,
  onLoad = utils.noop,
  onError = utils.noop,
}: Props) {
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
