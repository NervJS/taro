import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
