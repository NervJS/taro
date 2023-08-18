import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-加速器
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopAccelerometer',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopAccelerometer')
          Taro.stopAccelerometer().then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'startAccelerometer',
        func: (apiIndex) => {
          TestConsole.consoleTest('startAccelerometer')
          Taro.startAccelerometer().then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'onAccelerometerChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onAccelerometerChange')
          Taro.onAccelerometerChange(this.callback)
        },
      },
      {
        id: 'offAccelerometerChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('offAccelerometerChange')
          Taro.offAccelerometerChange()
        },
      },
    ],
  }

  callback = (res: any) => {
    TestConsole.consoleNormal('AccelerometerChangeCallback', res)
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
