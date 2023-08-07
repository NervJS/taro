import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 基础-调试
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setEnableDebug',
        func: null,
      },
      {
        id: 'getRealtimeLogManager',
        func: null,
      },
      {
        id: 'getLogManager',
        func: null,
      },
      {
        id: 'console',
        func: null,
      },
      {
        id: 'LogManager',
        func: null,
      },
      {
        id: 'RealtimeLogManager',
        func: null,
      },
      {
        id: 'RealtimeTagLogManager',
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
