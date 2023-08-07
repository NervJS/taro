import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-网络
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onNetworkWeakChange',
        func: null,
      },
      {
        id: 'onNetworkStatusChange',
        func: null,
      },
      {
        id: 'offNetworkWeakChange',
        func: null,
      },
      {
        id: 'offNetworkStatusChange',
        func: null,
      },
      {
        id: 'getNetworkType',
        func: null,
      },
      {
        id: 'getLocalIPAddress',
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
