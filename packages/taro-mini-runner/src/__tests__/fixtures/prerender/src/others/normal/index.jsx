import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class Index extends Component {
  state = {
    loaded: false
  }
  render () {
    return this.state.loaded && (
      <View>
        <Text>normal</Text>
      </View>
    )
  }
}
