import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * Taro-拓展
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'eventCenter',
        func: null,
      },
      {
        id: 'getEnv',
        func: null,
      },
      {
        id: 'pxTransform',
        func: null,
      },
      {
        id: 'initPxTransform',
        func: null,
      },
      {
        id: 'getAppInfo',
        func: null,
      },
      {
        id: 'getRenderer',
        func: null,
      },
      {
        id: 'requirePlugin',
        func: null,
      },
      {
        id: 'getCurrentInstance',
        func: null,
      },
      {
        id: 'setGlobalDataPlugin',
        func: null,
      },
      {
        id: 'getTabBar',
        func: null,
      },
      {
        id: 'interceptorify',
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
