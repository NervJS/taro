import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 设备-陀螺仪
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopGyroscope',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopGyroscope')
          Taro.stopGyroscope({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'startGyroscope',
        func: (apiIndex) => {
          TestConsole.consoleTest('startGyroscope')
          Taro.startGyroscope({
            interval: 'normal',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'onGyroscopeChange',
        func: (apiIndex) => {
          Taro.onGyroscopeChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onGyroscopeChange', apiIndex)
          })
        },
      },
      {
        id: 'offGyroscopeChange_暂不支持',
        func: (apiIndex) => {
          Taro.offGyroscopeChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offGyroscopeChange', apiIndex)
          })
        },
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
