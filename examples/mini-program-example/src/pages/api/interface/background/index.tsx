import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-背景
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setBackgroundTextStyle',
        func: null,
      },
      {
        id: 'setBackgroundColor',
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
