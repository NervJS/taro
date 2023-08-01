import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-车牌
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'chooseLicensePlate',
        func: null,
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
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
