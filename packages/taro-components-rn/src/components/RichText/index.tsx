/**
 * ✔ nodes
 */

import * as React from 'react'
import { View } from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'
import { RichTextProps, RichTextState, Node } from './PropsType'
import { omit } from '../../utils'

class _RichText extends React.Component<RichTextProps, RichTextState> {
  static defaultProps = {
    nodes: ''
  }

  state: RichTextState = {
    webViewHeight: 0
  }

  private webview = React.createRef<WebView>()

  renderChildrens = (arr: Node []): string => {
    if (arr.length === 0) return ''
    return arr.map((list) => {
      if (list.type === 'text') {
        return list.text
      }
      return this.renderNodes(list)
    }).join('')
  }

  renderNodes = (item: Node): string => {
    const child = item.children ? this.renderChildrens(item.children) : ''
    return `<${item.name} ${item.attrs && Object.keys(item.attrs).map(key => {
      return `${key}="${item.attrs[key]}"`
    }).join(' ')}>${child}</${item.name}>`
  }

  onWebViewMessage = (event: WebViewMessageEvent):void => {
    this.setState({
      webViewHeight: Number(event.nativeEvent.data)
    })
  }

  render (): JSX.Element {
    const {
      style,
      nodes
    } = this.props

    const otherProps = omit(this.props, ['style', 'nodes'])

    const html: string = typeof nodes === 'string'
      ? nodes
      : nodes.map((item: Node): string => {
        return this.renderNodes(item)
      }).join('')

    return (
      <View style={Object.assign({
        height: this.state.webViewHeight,
        width: '100%',
      }, style)}>
        <WebView
          ref={this.webview}
          source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' + html }}
          scalesPageToFit={false}
          onMessage={this.onWebViewMessage}
          injectedJavaScript={`
            document.documentElement.style.padding = 0;
            document.documentElement.style.margin = 0;
            document.body.style.padding = 0;
            document.body.style.margin = 0;
            window.ReactNativeWebView.postMessage(document.body.scrollHeight);
            true;
          `}
          onLoadEnd={() => this.webview.current?.injectJavaScript('window.ReactNativeWebView.postMessage(document.body.scrollHeight);')} // android
          style={{
            backgroundColor: 'transparent'
          }}
          {...otherProps}
        />
      </View>
    )
  }
}

export default _RichText
