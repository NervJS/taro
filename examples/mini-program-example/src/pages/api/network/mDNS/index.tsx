import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 网络-mDNS
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopLocalServiceDiscovery',
        func: null,
      },
      {
        id: 'startLocalServiceDiscovery',
        func: null,
      },
      {
        id: 'onLocalServiceResolveFail',
        func: null,
      },
      {
        id: 'onLocalServiceLost',
        func: null,
      },
      {
        id: 'onLocalServiceFound',
        func: null,
      },
      {
        id: 'onLocalServiceDiscoveryStop',
        func: null,
      },
      {
        id: 'offLocalServiceResolveFail',
        func: null,
      },
      {
        id: 'offLocalServiceLost',
        func: null,
      },
      {
        id: 'offLocalServiceFound',
        func: null,
      },
      {
        id: 'offLocalServiceDiscoveryStop',
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
