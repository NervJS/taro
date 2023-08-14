import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-下拉更新
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopPullDownRefresh',
        func: (apiIndex) => {
          Taro.startPullDownRefresh({
            success: (res) => {
              console.log('startPullDownRefresh success ', res)
              setTimeout(() => {
                Taro.stopPullDownRefresh({
                  success: (res) => {
                    console.log('stopPullDownRefresh success ', res)
                  },
                  fail: (res) => {
                    console.log('stopPullDownRefresh fail ', res)
                  },
                  complete: (res) => {
                    console.log('stopPullDownRefresh complete ', res)
                  },
                })
              }, 5000)
            },
          })
        },
      },
      {
        id: 'startPullDownRefresh',
        func: (apiIndex) => {
          Taro.startPullDownRefresh({
            success: (res) => {
              console.log('startPullDownRefresh success ', res)
            },
            fail: (res) => {
              console.log('startPullDownRefresh fail ', res)
            },
            complete: (res) => {
              console.log('startPullDownRefresh complete ', res)
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
