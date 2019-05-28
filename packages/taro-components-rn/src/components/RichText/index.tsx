/**
 * ✔ nodes
 */

import * as React from 'react'
import {
  View,
  WebView,
} from 'react-native'
import * as ReactDOMServer from 'react-dom/server.browser'
import { omit, parseStyles } from '../../utils'
import { RichTextProps, Node } from './PropsType'

class _RichText extends React.Component<RichTextProps> {
  static defaultProps = {
    nodes: ''
  }

  renderChildrens = (arr: Array<any> = []) => {
    if (arr.length === 0) return
    return arr.map((list) => {
      if (list.type === 'text') {
        return this.renderText(list.text)
      }
      return this.renderNodes(list)
    })
  }

  renderText = (text: string = '') => {
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

  render () {
    const {
      style,
      nodes,
    } = this.props

    const html: string = typeof nodes === 'string'
      ? nodes
      : nodes.map((item: Node): string => {
        return ReactDOMServer.renderToStaticMarkup(this.renderNodes(item))
      }).join(',')

    return (
      <View style={style}>
        <WebView
          source={{ html }}
          scalesPageToFit={false}
          injectedJavaScript={`
            document.documentElement.style.padding = 0;
            document.documentElement.style.margin = 0;
            document.body.style.padding = 0;
            document.body.style.margin = 0;
            true;
          `}
          style={{
            backgroundColor: 'transparent'
          }}
        />
      </View>
    )
  }
}

export default _RichText
