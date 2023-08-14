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
        func: () => {
          TestConsole.consoleTest('Taro.setScreenBrightness')
          TestConsole.consoleNormal('Taro.setScreenBrightness value:', this.state.brightValue)
          Taro.setScreenBrightness({
            value: this.state.brightValue,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
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
        id: 'setKeepScreenOnTrue',
        func: () => {
          TestConsole.consoleTest('Taro.setKeepScreenOnTrue')
          Taro.setKeepScreenOn({
            keepScreenOn: true,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
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
        id: 'setKeepScreenOnFalse',
        func: () => {
          TestConsole.consoleTest('Taro.setKeepScreenOnFalse')
          Taro.setKeepScreenOn({
            keepScreenOn: false,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
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
        id: 'onUserCaptureScreen',
        func: () => {
          TestConsole.consoleTest('Taro.onUserCaptureScreen')
          Taro.onUserCaptureScreen(this.userCaptureScreen)
          TestConsole.consoleTest('Taro.onUserCaptureScreen end')
        },
      },
      {
        id: 'offUserCaptureScreen',
        func: () => {
          TestConsole.consoleTest('Taro.offUserCaptureScreen')
          Taro.offUserCaptureScreen(this.userCaptureScreen)
          TestConsole.consoleTest('Taro.offUserCaptureScreen end')
        },
      },
      {
        id: 'getScreenBrightness',
        func: () => {
          TestConsole.consoleTest('Taro.getScreenBrightness')
          Taro.getScreenBrightness({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
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
