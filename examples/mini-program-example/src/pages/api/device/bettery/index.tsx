import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
        func: (apiIndex) => {
          TestConsole.consoleTest('getBatteryInfo')
          Taro.getBatteryInfo({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              this.setState({ batteryInfo: { isCharging: res.isCharging, level: res.level, errMsg: res.errMsg } })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
            .then((res) => {
              TestConsole.consoleResult.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleResult.call(this, err, apiIndex)
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
        <View style={{ display: 'inline-block' }}>
          <View>是否正在充电：{batteryInfo.isCharging ? '是' : '否'}</View>
          <View>设备电量：{batteryInfo.level}%</View>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
