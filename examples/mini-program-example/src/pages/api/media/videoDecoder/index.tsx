import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 媒体-视频解码器
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createVideoDecoder',
        func: null,
      },
      {
        id: 'VideoDecoder',
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
