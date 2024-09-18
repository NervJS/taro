import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

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
        func: (apiIndex) => {
          TestConsole.consoleTest('createCameraContext')
          cameraContext = Taro.createCameraContext()
          TestConsole.consoleSuccess.call(this, cameraContext, apiIndex)
        },
      },
      {
        id: 'createCameraContext_onCameraFrame_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('onCameraFrame')
          cameraContext.onCameraFrame((frame) => {
            TestConsole.consoleNormal('onCameraFrame callback :', frame)
          })
        },
      },
      {
        id: 'createCameraContext_setZoom_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('setZoom')
          cameraContext
            .setZoom({
              zoom: 70,
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
        id: 'createCameraContext_startRecord',
        func: (apiIndex) => {
          TestConsole.consoleTest('startRecord')
          cameraContext
            .startRecord({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
              timeoutCallback: (res) => {
                TestConsole.consoleNormal('startRecord callback :', res)
              },
            })
        },
      },
      {
        id: 'createCameraContext_stopRecord',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopRecord')
          cameraContext
            .stopRecord({
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
        id: 'createCameraContext_takePhoto',
        func: (apiIndex) => {
          TestConsole.consoleTest('takePhoto')
          cameraContext
            .takePhoto({
              quality: 'normal',
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
