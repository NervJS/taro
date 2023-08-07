import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-罗盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopCompass',
        func: null,
      },
      {
        id: 'startCompass',
        func: null,
      },
      {
        id: 'onCompassChange',
        func: null,
      },
      {
        id: 'offCompassChange',
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
