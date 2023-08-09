import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-设置
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'openSetting',
        func: null,
      },
      {
        id: 'getSetting',
        func: null,
      },
      {
        id: 'AuthSetting',
        func: null,
      },
      {
        id: 'SubscriptionsSetting',
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
