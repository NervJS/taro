import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * AI-视觉算法
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'isVKSupport',
        func: null,
      },
      {
        id: 'createVKSession',
        func: null,
      },
      {
        id: 'VKAnchor',
        func: null,
      },
      {
        id: 'VKCamera',
        func: null,
      },
      {
        id: 'VKFrame',
        func: null,
      },
      {
        id: 'VKSession',
        func: null,
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
