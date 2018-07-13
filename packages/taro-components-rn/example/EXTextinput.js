import React, { Component } from 'react'
import { View, Input, Textarea } from '../src'

export default class EXTextinput extends Component {
  onInput = (event) => {
    if (event.detail.value.length >= 6) {
      return 'hehe'
    }
  }

  render () {
    return (
      <View>
        <Input
          type="idcard"
          placeholder="placeholder"
          onInput={this.onInput}
        />

        <Textarea
          placeholder="textarea"
          style={{
            width: 300,
            height: 30
          }}
          autoHeight
        />
      </View>
    )
  }
}
