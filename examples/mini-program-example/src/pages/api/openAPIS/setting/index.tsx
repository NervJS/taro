import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
        func: () => {
          Taro.onMemoryWarning(function () {
            console.log('success on memory warning.')
            console.log('memory is run out.')
          })
        },
      },
      {
        id: 'offMemoryWarning',
        func: () => {
          Taro.offMemoryWarning(function () {
            console.log('success off memory warning.')
            console.log('memory is enough.')
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
