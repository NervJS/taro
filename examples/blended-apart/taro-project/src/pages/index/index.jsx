import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  render () {
    return (
      <View className='red index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
