import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 网络-TCP 通信
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createTCPSocket',
        func: null,
      },
      {
        id: 'TCPSocket',
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
