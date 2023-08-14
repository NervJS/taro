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
        id: 'setVisualEffectOnCapture',
        func: null,
      },
      {
        id: 'setScreenBrightness',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.setScreenBrightness')
          TestConsole.consoleNormal('Taro.setScreenBrightness value:', this.state.brightValue)
          Taro.setScreenBrightness({
            value: this.state.brightValue,
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
        id: 'setKeepScreenOnTrue',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.setKeepScreenOnTrue')
          Taro.setKeepScreenOn({
            keepScreenOn: true,
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
        id: 'setKeepScreenOnFalse',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.setKeepScreenOnFalse')
          Taro.setKeepScreenOn({
            keepScreenOn: false,
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
          TestConsole.consoleTest('Taro.onUserCaptureScreen end')
        },
      },
      {
        id: 'offUserCaptureScreen',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offUserCaptureScreen')
          Taro.offUserCaptureScreen(this.userCaptureScreen)
          TestConsole.consoleTest('Taro.offUserCaptureScreen end')
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
    brightValue: 0,
    isKeepOn: false,
  }

  userCaptureScreen = (res) => {
    TestConsole.consoleSuccess('result ' + JSON.stringify(res))
  }

  changeBrightness = (e) => {
    let value = parseFloat(e.detail.value)
    this.setState({
      brightValue: value,
    })
  }
  render() {
    const { list, brightValue } = this.state
    return (
      <View className='api-page'>
        <View className='form-item'>
          <Text className='input-text'>请输入屏幕亮度：</Text>
          <Input
            type='digit'
            value={brightValue}
            placeholder='请设置屏幕亮度,值0-1之间'
            onInput={this.changeBrightness}
          />
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
