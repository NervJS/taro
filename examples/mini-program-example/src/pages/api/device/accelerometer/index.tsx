import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
