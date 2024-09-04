import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-蓝牙-信标(Beacon)
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopBeaconDiscovery',
        func: null,
      },
      {
        id: 'startBeaconDiscovery',
        func: null,
      },
      {
        id: 'onBeaconUpdate',
        func: null,
      },
      {
        id: 'onBeaconServiceChange',
        func: null,
      },
      {
        id: 'offBeaconUpdate',
        func: null,
      },
      {
        id: 'offBeaconServiceChange',
        func: null,
      },
      {
        id: 'getBeacons',
        func: null,
      },
      {
        id: 'IBeaconInfo',
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
