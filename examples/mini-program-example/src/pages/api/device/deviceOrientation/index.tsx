import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-设备方向
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopDeviceMotionListening',
        func: null,
      },
      {
        id: 'startDeviceMotionListening',
        func: null,
      },
      {
        id: 'onDeviceMotionChange',
        func: null,
      },
      {
        id: 'offDeviceMotionChange',
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
