import React, { Component } from 'react'
import { View, RichText } from '../../dist'

export default class EXRichText extends Component {
  richTextNodes = [{
    name: 'div',
    attrs: {
      class: 'div_class',
      style: 'line-height: 60px; color: red; font-size: 32px;'
    },
    children: [{
      type: 'text',
      text: 'Hello&nbsp;World!'
    }]
  }]

  render () {
    return (
      <RichText
        nodes={this.richTextNodes}
        style={{
          width: 300,
          height: 100,
          borderColor: 'orange',
          borderWidth: 1
        }}
      />
    )
  }
}
