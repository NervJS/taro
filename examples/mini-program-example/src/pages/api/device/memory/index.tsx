import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-内存
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onMemoryWarning',
        func: (apiIndex) => {
          Taro.onMemoryWarning(function () {
            console.log('success on memory warning.')
            console.log('memory is run out.')
          })
        },
      },
      {
        id: 'offMemoryWarning',
        func: (apiIndex) => {
          Taro.offMemoryWarning(function () {
            console.log('success off memory warning.')
            console.log('memory is enough.')
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
