import React, { Component } from 'react'
import { View, RichText } from '../src'

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
      <View>
        <RichText
          nodes={this.richTextNodes}
          style={{
            width: 300,
            height: 200,
            borderColor: 'black',
            borderWidth: 1
          }}
        />
      </View>
    )
  }
}
