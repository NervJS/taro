import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 广告
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createRewardedVideoAd',
        func: null,
      },
      {
        id: 'createInterstitialAd',
        func: null,
      },
      {
        id: 'InterstitialAd',
        func: null,
      },
      {
        id: 'RewardedVideoAd',
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
