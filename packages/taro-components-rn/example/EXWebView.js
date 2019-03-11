import React, { Component } from 'react'
import { WebView } from '../src'

export default class EXSlider extends Component {
  render () {
    return (
      <WebView src="https://taro.aotu.io/" style={{ width: 300, height: 150 }} />
    )
  }
}
