import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-账户信息
 * @returns
 */

export default class Index extends React.Component {
  state = {
    api: {
      id: 'getAccountInfoSync',
      func: null,
    },
  }
  render() {
    const { api } = this.state
    return (
      <View className='api-page'>
        <View key={api.id} className='api-page-btn' onClick={api.func == null ? () => {} : api.func}>
          {api.id}
          {api.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
        </View>
      </View>
    )
  }
}
