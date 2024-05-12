import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * AI-推理
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getInferenceEnvInfo',
        func: null,
      },
      {
        id: 'createInferenceSession',
        func: null,
      },
      {
        id: 'InferenceSession',
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
