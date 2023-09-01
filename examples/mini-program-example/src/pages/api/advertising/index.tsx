import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 广告
 * @returns
 */

export default class Index extends React.Component {
  state = {
    ad: {} as Taro.InterstitialAd,
    list: [
      {
        id: 'createRewardedVideoAd',
        func: null,
      },
      {
        id: 'createInterstitialAd',
        inputData: {
          adUnitId: '',
        },
        func: (_, data) => {
          TestConsole.consoleTest('Taro.createInterstitialAd')
          const ad = Taro.createInterstitialAd(data)
          TestConsole.consoleNormal('createInterstitialAd', ad)
          this.setState({ ad })
          ad.onError((res) => {
            TestConsole.consoleNormal('InterstitialAd.onError', res)
          })
          ad.onLoad((res) => {
            TestConsole.consoleNormal('InterstitialAd.onLoad', res)
          })
          ad.onClose(() => {
            TestConsole.consoleNormal('InterstitialAd.onClose')
          })
        },
      },
      {
        id: 'InterstitialAd.show',
        inputData: {
          adUnitId: '',
        },
        func: () => {
          TestConsole.consoleTest('InterstitialAd.show')
          if (this.state.ad) {
            this.state.ad.show().then(() => {
              TestConsole.consoleNormal('InterstitialAd.show')
            })
          }
        },
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
