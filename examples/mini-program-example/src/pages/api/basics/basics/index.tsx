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
        func: () => {
          TestConsole.consoleTest('Taro.canIUseWebp')
          TestConsole.consoleSuccess('Taro.canIUseWebp: ' + Taro.env)
        },
      },
      {
        id: 'canIUse',
        func: () => {
          TestConsole.consoleTest('Taro.canIUse')
          TestConsole.consoleSuccess('Taro.canIUse openBluetoothAdapter ' + Taro.canIUse('openBluetoothAdapter'))
          TestConsole.consoleSuccess(
            'Taro.canIUse getSystemInfoSync.return.screenWidth ' + Taro.canIUse('getSystemInfoSync.return.screenWidth')
          )
          TestConsole.consoleSuccess(
            'Taro.canIUse getSystemInfo.success.screenWidth ' + Taro.canIUse('getSystemInfo.success.screenWidth')
          )
          TestConsole.consoleSuccess('Taro.canIUse showToast.object.image ' + Taro.canIUse('showToast.object.image'))
          TestConsole.consoleSuccess(
            'Taro.canIUse onCompassChange.callback.direction ' + Taro.canIUse('onCompassChange.callback.direction')
          )
          TestConsole.consoleSuccess(
            'Taro.canIUse request.object.method.GET ' + Taro.canIUse('request.object.method.GET')
          )
          TestConsole.consoleSuccess('Taro.canIUse live-player ' + Taro.canIUse('live-player'))
          TestConsole.consoleSuccess('Taro.canIUse text.selectable ' + Taro.canIUse('text.selectable'))
          TestConsole.consoleSuccess(
            'Taro.canIUse button.open-type.contact ' + Taro.canIUse('button.open-type.contact')
          )
        },
      },
      {
        id: 'canIuseWebp',
        func: () => {
          TestConsole.consoleTest('Taro.canIUseWebp')
          try {
            const res = Taro.canIUseWebp()
            TestConsole.consoleSuccess('Taro.canIUseWebp: ' + res)
          } catch (err) {
            TestConsole.consoleFail('Taro.canIUseWebp error: ' + err)
          }
        },
      },
      {
        id: 'base64ToArrayBuffer',
        func: () => {
          TestConsole.consoleTest('Taro.base64ToArrayBuffer')
          const base64 = 'CxYh'
          const res = Taro.base64ToArrayBuffer(base64)
          TestConsole.consoleNormal('Taro.base64ToArrayBuffer before: ', base64)
          TestConsole.consoleSuccess('Taro.base64ToArrayBuffer after: ' + res)
        },
      },
      {
        id: 'arrayBufferToBase64',
        func: () => {
          TestConsole.consoleTest('Taro.arrayBufferToBase64')
          const arrayBuffer = new Uint8Array([11, 22, 33])
          const res = Taro.arrayBufferToBase64(arrayBuffer)
          TestConsole.consoleNormal('Taro.arrayBufferToBase64 before: ', arrayBuffer)
          TestConsole.consoleSuccess('Taro.arrayBufferToBase64 after: ' + res)
        },
      },
      {
        id: 'perload',
        func: () => {
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
