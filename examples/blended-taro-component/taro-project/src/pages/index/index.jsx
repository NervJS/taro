import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Picker from '../../components/picker'

export default class Index extends Component {
  render () {
    return (
      <View>
        <View>Detail: </View>
        <Button onClick={() => Taro.navigateTo({ url: '/pages/detail/index' })}>Go To Detail</Button>

        <View>Picker: </View>
        <Picker title='test' list={['A', 'B', 'C']} onButtonClick={() => console.log('onclick')}></Picker>
      </View>
    )
  }
}
