import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-陀螺仪
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopGyroscope',
        func: () => {
          Taro.stopGyroscope({
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
        id: 'startGyroscope',
        func: () => {
          Taro.startGyroscope({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
            interval: 'normal',
          })
        },
      },
      {
        id: 'onGyroscopeChange',
        func: () => {
          Taro.onGyroscopeChange((res) => {
            console.log('on gyroscope change: ', res)
          })
        },
      },
      {
        id: 'offGyroscopeChange',
        func: () => {
          Taro.offGyroscopeChange((res) => {
            console.log('off gyroscope change: ', res)
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
