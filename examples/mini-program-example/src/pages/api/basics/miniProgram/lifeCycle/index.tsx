import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'

/**
 * 基础-生命周期
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getLaunchOptionsSync',
        func: null,
      },
      {
        id: 'getEnterOptionsSync',
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
