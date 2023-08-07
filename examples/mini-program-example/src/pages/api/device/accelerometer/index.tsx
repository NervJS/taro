import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-加速器
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopAccelerometer',
        func: null,
      },
      {
        id: 'startAccelerometer',
        func: null,
      },
      {
        id: 'onAccelerometerChange',
        func: null,
      },
      {
        id: 'offAccelerometerChange',
        func: null,
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
