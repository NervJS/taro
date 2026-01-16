import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-微信运动
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'shareToWeRun',
        func: null,
      },
      {
        id: 'getWeRunData',
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
