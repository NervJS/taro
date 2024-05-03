import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-音视频通话设备
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'requestDeviceVolP',
        func: null,
      },
      {
        id: 'getDeviceVolPList',
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
