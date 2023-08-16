import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 回调结构内容
 * @returns
 */

interface Props {
  testApi: string
  callbackRes: any
}

export default class Index extends React.Component<Props> {
  state = {}
  render() {
    const { testApi, callbackRes } = this.props
    return (
      <View className='callback-content'>
        <View className='callback-res' id={`${testApi}-callback`}>
          {JSON.stringify(callbackRes)}
        </View>
      </View>
    )
  }
}
