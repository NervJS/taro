import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 媒体-地图
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createMapContext',
        func: null,
      },
      {
        id: 'MapContext',
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
