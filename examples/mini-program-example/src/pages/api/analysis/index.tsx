import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 数据分析
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'reportMonitor',
        func: null,
      },
      {
        id: 'reportEvent',
        func: null,
      },
      {
        id: 'reportAnalytics',
        func: null,
      },
      {
        id: 'getExptInfoSync',
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
