import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 基础
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'env',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.canIUseWebp')
          TestConsole.consoleSuccess.call(this, Taro.env, apiIndex)
        },
      },
      {
        id: 'canIUse',
        inputData: {
          apiName: 'openBluetoothAdapter',
        },
        func: (apiIndex, data) => {
          const { apiName } = data
          TestConsole.consoleTest(`Taro.canIUse: ${apiName}`)
          TestConsole.consoleSuccess.call(this, Taro.canIUse(apiName), apiIndex)
          // TestConsole.consoleSuccess('Taro.canIUse getSystemInfoSync.return.screenWidth ' +  Taro.canIUse('getSystemInfoSync.return.screenWidth'));
          // TestConsole.consoleSuccess('Taro.canIUse getSystemInfo.success.screenWidth ' +  Taro.canIUse('getSystemInfo.success.screenWidth'));
          // TestConsole.consoleSuccess('Taro.canIUse showToast.object.image ' +  Taro.canIUse('showToast.object.image'));
          // TestConsole.consoleSuccess('Taro.canIUse onCompassChange.callback.direction ' +  Taro.canIUse('onCompassChange.callback.direction'));
          // TestConsole.consoleSuccess('Taro.canIUse request.object.method.GET ' +  Taro.canIUse('request.object.method.GET'));
          // TestConsole.consoleSuccess('Taro.canIUse live-player ' +  Taro.canIUse('live-player'));
          // TestConsole.consoleSuccess('Taro.canIUse text.selectable ' +  Taro.canIUse('text.selectable'));
          // TestConsole.consoleSuccess('Taro.canIUse button.open-type.contact ' +  Taro.canIUse('button.open-type.contact'));
        },
      },
      {
        id: 'canIuseWebp',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.canIUseWebp')
          try {
            const res = Taro.canIUseWebp()
            TestConsole.consoleSuccess.call(this, res, apiIndex)
          } catch (err) {
            TestConsole.consoleFail.call(this, err, apiIndex)
          }
        },
      },
      {
        id: 'base64ToArrayBuffer',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.base64ToArrayBuffer')
          const base64 = 'CxYh'
          const arrayBuffer = Taro.base64ToArrayBuffer(base64)
          TestConsole.consoleNormal('Taro.base64ToArrayBuffer before: ', base64)
          TestConsole.consoleNormal('Taro.base64ToArrayBuffer after: ', arrayBuffer)
          const res = {
            Int8Array: new Int8Array(arrayBuffer),
            Uint8Array: new Uint8Array(arrayBuffer),
            ArrayBufferByteLength: arrayBuffer.byteLength,
          }
          TestConsole.consoleResult.call(this, res, apiIndex)
        },
      },
      {
        id: 'arrayBufferToBase64',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.arrayBufferToBase64')
          const arrayBuffer = new Uint8Array([11, 22, 33])
          const res = Taro.arrayBufferToBase64(arrayBuffer)
          TestConsole.consoleNormal('Taro.arrayBufferToBase64 before: ', arrayBuffer)
          TestConsole.consoleSuccess.call(this, res, apiIndex)
        },
      },
      {
        id: 'perload',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.perload')
          Taro.preload('x', 1)
          TestConsole.consoleNormal('Taro.perload', '向页面 /pages/index/index 传递参数{x,1}')
          Taro.navigateTo({ url: '/pages/index/index' })
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
