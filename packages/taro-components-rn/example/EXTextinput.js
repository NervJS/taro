import React, { Component } from 'react'
import { View, Input, Textarea } from '../src'

export default class EXTextinput extends Component {
  onInput = (event) => {
    if (event.detail.value.length >= 6) {
      return 'hehe'
    }
  }

  onKeyDown = (event) => {
    console.log('onKeyDown', event)
  }

  onConfirm = (event) => {
    console.log('onConfirm', event)
  }

  render () {
    return (
      <View>
        <Input
          type="idcard"
          placeholder="placeholder"
          onKeyDown={this.onKeyDown}
          onConfirm={this.onConfirm}
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
