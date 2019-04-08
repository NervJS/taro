import React, { Component } from 'react'
import { View, Slider } from '../dist'

export default class EXSlider extends Component {
  state = {
    progressPercent: 70
  }

  onSliderValueChange = (event) => {
    // this.setState({ progressPercent: event.detail.value })
  }

  render () {
    return (
      <View style={{width: 300}}>
        <Slider
          value={this.state.progressPercent}
          showValue={true}
          onChange={this.onSliderValueChange}
        />
      </View>
    )
  }
}
