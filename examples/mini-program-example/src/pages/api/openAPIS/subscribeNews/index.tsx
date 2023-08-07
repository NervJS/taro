import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-订阅消息
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'requestSubscribeMessage',
        func: null,
      },
      {
        id: 'requestSubscribeDeviceMessage',
        func: null,
      },
    ],
  }
  render() {
    let { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
