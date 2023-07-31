import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-电池
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getBatteryInfo',
        func: () => {
          Taro.getBatteryInfo({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'getBatteryInfoSync',
        func: null,
      },
    ],
    batteryInfo: {},
  }
  render() {
    const { list, batteryInfo } = this.state
    return (
      <View className='api-page'>
        <View>是否正在充电：{batteryInfo.isCharging ? '是' : '否'}</View>
        <View>设备电量：{batteryInfo.level}%</View>
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
