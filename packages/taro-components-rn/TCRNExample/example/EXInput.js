import React, { Component } from 'react'
import { View, Input, Textarea } from '../../dist'

export default class EXTextinput extends Component {
  state = {
    inputValue: undefined
  }

  onInput = (event) => {
    if (event.detail.value.length >= 8) {
      return 'hehe'
    }
  }

  onKeyDown = (event) => {
    console.log('onKeyDown', event)
  }

  onConfirm = (event) => {
    console.log('onConfirm', event)
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ inputValue: '123' })
    }, 3000)
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
          value={this.state.inputValue}
          placeholderTextColor="red"
        />

        <Textarea
          placeholder="textarea"
          style={{
            width: 300,
            height: 30
          }}
          autoHeight
          placeholderTextColor="red"
        />
      </View>
    )
  }
}
