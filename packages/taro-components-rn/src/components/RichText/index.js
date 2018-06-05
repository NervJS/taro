/**
 * ✔ nodes
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  WebView,
  StyleSheet,
} from 'react-native'
import ReactDOMServer from 'react-dom/server.browser'
import { omit, parseStyles } from '../../utils'

type Props = {
  style?: StyleSheet.Styles,
  nodes: Array<Object> | string
}

class _RichText extends React.Component<Props> {
  props: Props

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

  renderNodes = (item: Object) => {
    const child = this.renderChildrens(item.children)
    return React.createElement(
      item.name,
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

    const html = typeof nodes === 'string' ? nodes : ReactDOMServer.renderToStaticMarkup(nodes.map((item) => {
      return this.renderNodes(item)
    }))

    return (
      <View style={style}>
        <WebView
          source={{ html }}
          scalesPageToFit={false}
        />
      </View>
    )
  }
}

export default _RichText
