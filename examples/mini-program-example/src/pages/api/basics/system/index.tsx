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
        func: () => {
          TestConsole.consoleTest('Taro.openAppAuthorizeSetting')
          Taro.openAppAuthorizeSetting({
            success(res) {
              TestConsole.consoleSuccess('Taro.openAppAuthorizeSetting ' + JSON.stringify(res))
            },
            fail(res) {
              TestConsole.consoleFail('Taro.openAppAuthorizeSetting ' + JSON.stringify(res))
            },
            complete(res) {
              TestConsole.consoleComplete('Taro.openAppAuthorizeSetting ' + JSON.stringify(res))
            },
          })
        },
      },
      {
        id: 'getWindowInfo',
        func: async () => {
          TestConsole.consoleTest('Taro.getWindowInfo')
          const res = await Taro.getWindowInfo()
          TestConsole.consoleSuccess('Taro.getWindowInfo ' + JSON.stringify(res))
        },
      },
      {
        id: 'getSystemSetting',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemSetting')
          const res = Taro.getSystemSetting()
          TestConsole.consoleSuccess('Taro.getSystemSetting ' + JSON.stringify(res))
        },
      },
      {
        id: 'getSystemInfoSync',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfoSync')
          try {
            const res = Taro.getSystemInfoSync()
            TestConsole.consoleSuccess('Taro.getSystemInfoSync ' + JSON.stringify(res))
          } catch (e) {
            TestConsole.consoleFail('Taro.getSystemInfoSync ' + JSON.stringify(e))
          }
        },
      },
      {
        id: 'getSystemInfoAsync',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfoAsync')
          Taro.getSystemInfoAsync({
            success: function (res) {
              TestConsole.consoleSuccess('Taro.getSystemInfoAsync ' + JSON.stringify(res))
            },
            fail: function (res) {
              TestConsole.consoleFail('Taro.getSystemInfoAsync ' + JSON.stringify(res))
            },
            complete: function (res) {
              TestConsole.consoleComplete('Taro.getSystemInfoAsync ' + JSON.stringify(res))
            },
          })
        },
      },
      {
        id: 'getSystemInfo',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfo')
          Taro.getSystemInfo({
            success: function (res) {
              TestConsole.consoleSuccess('Taro.getSystemInfo ' + JSON.stringify(res))
            },
            fail: function (res) {
              TestConsole.consoleFail('Taro.getSystemInfo ' + JSON.stringify(res))
            },
            complete: function (res) {
              TestConsole.consoleComplete('Taro.getSystemInfo ' + JSON.stringify(res))
            },
          })
        },
      },
      {
        id: 'getDeviceInfo',
        func: () => {
          TestConsole.consoleTest('Taro.getDeviceInfo')
          let res = Taro.getDeviceInfo()
          TestConsole.consoleSuccess('Taro.getDeviceInfo ' + JSON.stringify(res))
        },
      },
      {
        id: 'getAppBaseInfo',
        func: async () => {
          TestConsole.consoleTest('Taro.getAppBaseInfo')
          let res = await Taro.getAppBaseInfo()
          TestConsole.consoleSuccess('Taro.getAppBaseInfo ' + JSON.stringify(res))
        },
      },
      {
        id: 'getAppAuthorizeSetting',
        func: async () => {
          TestConsole.consoleTest('Taro.getAppAuthorizeSetting')
          let res = await Taro.getAppAuthorizeSetting()
          TestConsole.consoleSuccess('Taro.getAppAuthorizeSetting ' + JSON.stringify(res))
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
