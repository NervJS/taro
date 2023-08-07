import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
          console.log('Taro.env ', Taro.env)
        },
      },
      {
        id: 'canIUse',
        func: () => {
          console.log('Taro.canIUse openBluetoothAdapter ', Taro.canIUse('openBluetoothAdapter'))
          console.log(
            'Taro.canIUse getSystemInfoSync.return.screenWidth ',
            Taro.canIUse('getSystemInfoSync.return.screenWidth')
          )
          console.log(
            'Taro.canIUse getSystemInfo.success.screenWidth ',
            Taro.canIUse('getSystemInfo.success.screenWidth')
          )
          console.log('Taro.canIUse showToast.object.image ', Taro.canIUse('showToast.object.image'))
          console.log(
            'Taro.canIUse onCompassChange.callback.direction ',
            Taro.canIUse('onCompassChange.callback.direction')
          )
          console.log('Taro.canIUse request.object.method.GET ', Taro.canIUse('request.object.method.GET'))
          console.log('Taro.canIUse live-player ', Taro.canIUse('live-player'))
          console.log('Taro.canIUse text.selectable ', Taro.canIUse('text.selectable'))
          console.log('Taro.canIUse button.open-type.contact ', Taro.canIUse('button.open-type.contact'))
        },
      },
      {
        id: 'canIuseWebp',
        func: () => {
          const res = Taro.canIUseWebp()
          console.log('Taro.canIUseWebp success', res)
          Taro.showModal({ content: 'Taro.canIUseWebp success ' + JSON.stringify(res) })
        },
      },
      {
        id: 'base64ToArrayBuffer',
        func: () => {
          const base64 = 'CxYh'
          const res = Taro.base64ToArrayBuffer(base64)
          console.log('Taro.base64ToArrayBuffer success', res)
          Taro.showModal({ content: 'Taro.base64ToArrayBuffer success ' + JSON.stringify(res) })
        },
      },
      {
        id: 'arrayBufferToBase64',
        func: () => {
          const arrayBuffer = new Uint8Array([11, 22, 33])
          const res = Taro.arrayBufferToBase64(arrayBuffer)
          console.log('Taro.arrayBufferToBase64 success', res)
          Taro.showModal({ content: 'Taro.arrayBufferToBase64 success ' + JSON.stringify(res) })
        },
      },
      {
        id: 'perload',
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
