import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class Index extends Component {
  render () {
    return (
      <View>
        <View>Detail: </View>
        <Button onClick={() => Taro.navigateTo({ url: '/taro/pages/detail/index' })}>Go To Detail</Button>
        <View>Picker: </View>

        {/** Taro原生组件调用方式 */}
        <c-picker props={{
          title: 'test', 
          list: ['A', 'B', 'C'],
          onButtonClick: () => console.log('onclick')
        }}></c-picker>
      </View>
    )
  }
}
