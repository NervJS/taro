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
        {/** Taro组件调用方式，如果转换为原生组件后需要自行再usingComponents中进行原生组件引用 */}
        <Picker title='test' list={['A', 'B', 'C']} onButtonClick={() => console.log('onclick')}></Picker>

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
