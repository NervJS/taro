import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 跳转
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'openBusinessView',
        func: null,
      },
      {
        id: 'openEmbeddedMiniProgram',
        func: null,
      },
      {
        id: 'navigateToMiniProgram',
        func: null,
      },
      {
        id: 'navigateBackMiniProgram',
        func: null,
      },
      {
        id: 'exitMiniProgram',
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
