import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-屏幕
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setScreenBrightness',
        inputData: {
          value: 0.5,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.setScreenBrightness')
          TestConsole.consoleNormal('Taro.setScreenBrightness value:', data.value)
          Taro.setScreenBrightness({
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
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'setKeepScreenOn',
        inputData: {
          keepScreenOn: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.setKeepScreenOn')
          Taro.setKeepScreenOn({
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
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'onUserCaptureScreen',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onUserCaptureScreen')
          Taro.onUserCaptureScreen(this.userCaptureScreen)
        },
      },
      {
        id: 'offUserCaptureScreen',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offUserCaptureScreen')
          Taro.offUserCaptureScreen(this.userCaptureScreen)
        },
      },
      {
        id: 'getScreenBrightness',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getScreenBrightness')
          Taro.getScreenBrightness({
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
    ],
  }

  userCaptureScreen = (res) => {
    TestConsole.consoleOnCallback(res, 'onUserCaptureScreen')
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
