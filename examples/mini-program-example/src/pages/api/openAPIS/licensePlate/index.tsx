import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-车牌
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'chooseLicensePlate',
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
