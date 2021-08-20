/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/**
 * ✔ nodes
 */

import * as React from 'react'
import { View } from 'react-native'
import {
  WebView
} from 'react-native-webview'
import * as ReactDOMServer from 'react-dom/server.browser'
import { omit, parseStyles } from '../../utils'
import { RichTextProps, Node } from './PropsType'

class _RichText extends React.Component<RichTextProps> {
  static defaultProps = {
    nodes: ''
  }

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
