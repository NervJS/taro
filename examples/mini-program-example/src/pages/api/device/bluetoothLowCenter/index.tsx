import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-蓝牙-低功耗中心设备
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'writeBLECharacteristicValue',
        func: null,
      },
      {
        id: 'setBLEMTU',
        func: null,
      },
      {
        id: 'readBLECharacteristicValue',
        func: null,
      },
      {
        id: 'onBLEMTUChange',
        func: null,
      },
      {
        id: 'onBLEConnectionStateChange',
        func: null,
      },
      {
        id: 'onBLECharacteristicValueChange',
        func: null,
      },
      {
        id: 'offBLEMTUChange',
        func: null,
      },
      {
        id: 'offBLEConnectionStateChange',
        func: null,
      },
      {
        id: 'offBLECharacteristicValueChange',
        func: null,
      },
      {
        id: 'notifyBLECharacteristicValueChange',
        func: null,
      },
      {
        id: 'getBLEMTU',
        func: null,
      },
      {
        id: 'getBLEDeviceServices',
        func: null,
      },
      {
        id: 'getBLEDeviceRSSI',
        func: null,
      },
      {
        id: 'getBLEDeviceCharacteristics',
        func: null,
      },
      {
        id: 'createBLEConnection',
        func: null,
      },
      {
        id: 'closeBLEConnection',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
