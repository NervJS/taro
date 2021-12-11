/**
 * ✔ nodes
 */

import * as React from 'react'
import { View } from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'
import * as ReactDOMServer from 'react-dom/server.browser'
import { omit, parseStyles } from '../../utils'
import { RichTextProps, RichTextState, Node } from './PropsType'

class _RichText extends React.Component<RichTextProps, RichTextState> {
  static defaultProps = {
    nodes: ''
  }

  state: RichTextState = {
    webViewHeight: 0
  }

  private webview = React.createRef<WebView>()

  renderChildrens = (arr: Array<any> = []): JSX.Element[] | undefined => {
    if (arr.length === 0) return
    return arr.map((list) => {
      if (list.type === 'text') {
        return this.renderText(list.text)
      }
      return this.renderNodes(list)
    })
  }

  renderText = (text = ''): JSX.Element => {
    return React.createElement('span', {
      dangerouslySetInnerHTML: { __html: text },
      key: Math.random()
    })
  }

  renderNodes = (item: Node): React.ReactElement => {
    const child = this.renderChildrens(item.children)
    return React.createElement(
      item.name || 'div',
      {
        key: Math.random(),
        ...omit(item.attrs, ['class', 'style']),
        className: item.attrs.class,
        style: parseStyles(item.attrs.style)
      },
      child
    )
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

    const html: string = typeof nodes === 'string'
      ? nodes
      : nodes.map((item: Node): string => {
        return ReactDOMServer.renderToStaticMarkup(this.renderNodes(item))
      }).join(',')

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
        />
      </View>
    )
  }
}

export default _RichText
