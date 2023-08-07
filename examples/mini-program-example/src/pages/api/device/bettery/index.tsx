import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
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
          TestConsole.consoleTest('getBatteryInfo')
          Taro.getBatteryInfo({
            success: (res) => {
              TestConsole.consoleSuccess(res)
              this.setState({batteryInfo:{isCharging: res.isCharging, level: res.level, errMsg: res.errMsg}})
              Taro.showModal({
                content:`success:${res.errMsg}`,
                showCancel: false,
                confirmText: 'CLOSE',
                confirmColor: '#00ff00'
              })
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
              Taro.showModal({
                content:`fail: ${res.errMsg}`,
                showCancel: false,
                confirmText: 'CLOSE',
                confirmColor: '#ff0000'
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
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
        <View style={{display:'inline-block'}}>
          <View>是否正在充电：{batteryInfo.isCharging ? '是' : '否'}</View>
          <View>设备电量：{batteryInfo.level}%</View>
        </View>
        {list.map((item) => {
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
