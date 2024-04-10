import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 第三方平台
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getExtConfigSync',
        func: null,
      },
      {
        id: 'getExtConfig',
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
