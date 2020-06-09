import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

export default class Index extends Component {
  render () {
    return (
      <View className='title'>
        <Text>{this.props.title}</Text>
      </View>
    )
  }
}
