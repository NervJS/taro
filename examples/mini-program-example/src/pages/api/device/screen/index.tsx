import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Slider } from '@tarojs/components'
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
        id: 'setScreenBrightness1',
        func: () => {
          Taro.setScreenBrightness({
            value: 1,
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'setScreenBrightness0',
        func: () => {
          Taro.setScreenBrightness({
            value: 0,
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'setKeepScreenOnTrue',
        func: () => {
          Taro.setKeepScreenOn({
            keepScreenOn: true,
            success: (res) => {
              console.log('setKeepScreenOn(true) success-----', res)
            },
            fail: (res) => {
              console.log('setKeepScreenOn(true) fail-----', res)
            },
            complete: (res) => {
              console.log('setKeepScreenOn(true) complete-----', res)
            },
          })
        },
      },
      {
        id: 'setKeepScreenOnFalse',
        func: () => {
          Taro.setKeepScreenOn({
            keepScreenOn: false,
            success: (res) => {
              console.log('setKeepScreenOn(false) success-----', res)
            },
            fail: (res) => {
              console.log('setKeepScreenOn(false) fail-----', res)
            },
            complete: (res) => {
              console.log('setKeepScreenOn(false) complete-----', res)
            },
          })
        },
      },
      {
        id: 'onUserCaptureScreen',
        func: () => {
          Taro.onUserCaptureScreen((res) => {
            console.log('success-----用户截屏了', res)
          })
        },
      },
      {
        id: 'offUserCaptureScreen',
        func: () => {
          Taro.offUserCaptureScreen((res) => {
            console.log('success-----取消截屏事件监听', res)
          })
        },
      },
      {
        id: 'getScreenBrightness0',
        func: () => {
          Taro.setScreenBrightness({
            value: 0,
            success: (res) => {
              console.log('setKeepScreenOn(true) success-----', res)
              Taro.getScreenBrightness({
                success: (res) => {
                  console.log('success-----', res)
                },
                fail: (res) => {
                  console.log('fail-----', res)
                },
                complete: (res) => {
                  console.log('complete-----', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'getScreenBrightness1',
        func: () => {
          Taro.setScreenBrightness({
            value: 1,
            success: (res) => {
              console.log('setKeepScreenOn(false) success-----', res)
              Taro.getScreenBrightness({
                success: (res) => {
                  console.log('success-----', res)
                },
                fail: (res) => {
                  console.log('fail-----', res)
                },
                complete: (res) => {
                  console.log('complete-----', res)
                },
              })
            },
          })
        },
      },
    ],
    brightValue: 0.5,
  }

  changeBrightness = (e) => {
    let value = parseFloat(e.detail.value.toFixed(1))
    this.setState({
      brightValue: value,
    })
    Taro.setScreenBrightness({
      value: value,
      success: (res) => {
        console.log('success-----', res)
      },
      fail: (res) => {
        console.log('fail-----', res)
      },
    })
  }
  render() {
    const { list, brightValue } = this.state
    return (
      <View className='api-page'>
        <View>当前屏幕亮度</View>
        <Text>{brightValue}</Text>
        <Slider step={0.1} value={brightValue} min={0} max={1} onChange={this.changeBrightness} />
        {list.map((item) => {
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
