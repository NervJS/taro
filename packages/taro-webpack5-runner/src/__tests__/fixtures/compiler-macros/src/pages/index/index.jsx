import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

definePageConfig({
  navigationBarTitleText: '首页'
})

export default class Index extends Component {
  render() {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
