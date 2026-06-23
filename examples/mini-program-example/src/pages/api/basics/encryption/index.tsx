import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 基础-加密
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getUserCryptoManager',
        func: null,
      },
      {
        id: 'UserCryptoManager',
        func: null,
      },
      {
        id: 'getRandomValues',
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
