import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'
/**
 * 基础-系统
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'openSystemBluetoothSetting',
        func: null,
      },
      {
        id: 'openAppAuthorizeSetting',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.openAppAuthorizeSetting')
          Taro.openAppAuthorizeSetting({
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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getWindowInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getWindowInfo')
          const res = Taro.getWindowInfo()
          TestConsole.consoleSuccess.call(this, res, apiIndex)
        },
      },
      {
        id: 'getSystemSetting',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getSystemSetting')
          const currentTime = Date.now()
          const res = Taro.getSystemSetting()
          const took = Date.now() - currentTime
          console.log('getSystemSetting took: ', took)
          TestConsole.consoleSuccess.call(this, res, apiIndex)
        },
      },
      {
        id: 'getSystemInfoSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getSystemInfoSync')
          try {
            const res = Taro.getSystemInfoSync()
            TestConsole.consoleSuccess.call(this, res, apiIndex)
          } catch (err) {
            TestConsole.consoleFail.call(this, err, apiIndex)
          }
        },
      },
      {
        id: 'getSystemInfoAsync',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getSystemInfoAsync')
          Taro.getSystemInfoAsync({
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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getSystemInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getSystemInfo')
          Taro.getSystemInfo({
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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getDeviceInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getDeviceInfo')
          let res = Taro.getDeviceInfo()
          TestConsole.consoleSuccess.call(this, res, apiIndex)
        },
      },
      {
        id: 'getAppBaseInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getAppBaseInfo')
          let res = Taro.getAppBaseInfo()
          TestConsole.consoleSuccess.call(this, res, apiIndex)
        },
      },
      {
        id: 'getAppAuthorizeSetting',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getAppAuthorizeSetting')
          let res = Taro.getAppAuthorizeSetting()
          TestConsole.consoleSuccess.call(this, res, apiIndex)
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
