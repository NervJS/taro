import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 基础-更新
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'updateWeChatApp',
        func: null,
      },
      {
        id: 'getUpdateManager',
        func: null,
      },
      {
        id: 'UpdateManager',
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
