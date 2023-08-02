import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from 'src/util/util'

/**
 * 媒体-相机
 * @returns
 */
let cameraContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createCameraContext',
        func: () => {
          TestConsole.consoleTest('createCameraContext')
          cameraContext = Taro.createCameraContext()
          TestConsole.consoleNormal('createCameraContext success')
        },
      },
      {
        id: 'createCameraContext_onCameraFrame_暂不支持',
        func: () => {
          TestConsole.consoleTest('onCameraFrame')
          cameraContext.onCameraFrame((frame) => {
            TestConsole.consoleNormal('onCameraFrame callback :', frame)
          })
        },
      },
      {
        id: 'createCameraContext_setZoom_暂不支持',
        func: () => {
          TestConsole.consoleTest('setZoom')
          cameraContext
            .setZoom({
              zoom: 70,
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_startRecord',
        func: () => {
          TestConsole.consoleTest('startRecord')
          cameraContext
            .startRecord({
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
              timeoutCallback: (res) => {
                TestConsole.consoleNormal('startRecord callback :', res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_stopRecord',
        func: () => {
          TestConsole.consoleTest('stopRecord')
          cameraContext
            .stopRecord({
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_takePhoto',
        func: () => {
          TestConsole.consoleTest('takePhoto')
          cameraContext
            .takePhoto({
              quality: 'normal',
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
    ],
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
