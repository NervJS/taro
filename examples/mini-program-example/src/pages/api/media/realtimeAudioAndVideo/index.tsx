import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 媒体-实时音视频
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createLivePusherContext',
        func: null,
      },
      {
        id: 'createLivePlayerContext',
        func: null,
      },
      {
        id: 'LivePlayerContext',
        func: null,
      },
      {
        id: 'LivePusherContext',
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
