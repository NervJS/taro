import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 媒体-音视频合成
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createMediaContainer',
        func: null,
      },
      {
        id: 'MediaContainer',
        func: null,
      },
      {
        id: 'MediaTrack',
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
