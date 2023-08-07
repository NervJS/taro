import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-蓝牙-低功耗外围设备
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onBLEPeripheralConnectionStateChanged',
        func: null,
      },
      {
        id: 'offBLEPeripheralConnectionStateChanged',
        func: null,
      },
      {
        id: 'createBLEPeripheralServer',
        func: null,
      },
      {
        id: 'BLEPeripheralServer',
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
