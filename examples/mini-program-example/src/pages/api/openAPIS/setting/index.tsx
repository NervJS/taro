import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 开放接口-设置
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'openSetting',
        inputData: {
          withSubscriptions: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.openSetting')
          Taro.openSetting(data).then((res) => {
            TestConsole.consoleNormal('openSetting', res)
          })
          Taro.openSetting({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'getSetting',
        inputData: {
          withSubscriptions: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.getSetting')
          Taro.getSetting(data).then((res) => {
            TestConsole.consoleNormal('getSetting', res)
          })
          Taro.getSetting({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'AuthSetting',
        func: null,
      },
      {
        id: 'SubscriptionsSetting',
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
