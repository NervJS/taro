import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-视频号
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'reserveChannelsLive',
        func: null,
      },
      {
        id: 'openChannelsUserProfile',
        func: null,
      },
      {
        id: 'openChannelsLive',
        func: null,
      },
      {
        id: 'openChannelsEvent',
        func: null,
      },
      {
        id: 'openChannelsActivity',
        func: null,
      },
      {
        id: 'getChannelsLiveNoticeInfo',
        func: null,
      },
      {
        id: 'getChannelsLiveInfo',
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
