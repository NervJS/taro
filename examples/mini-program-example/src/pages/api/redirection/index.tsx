import React from 'react'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import Taro from '@tarojs/taro'

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
        id: 'navigateToMiniProgram暂不支持',
        func: null,
      },
      {
        id: 'navigateBackMiniProgram',
        func: null,
      },
      {
        id: 'exitMiniProgram',
        func: () => {
          Taro.exitMiniProgram()
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
