import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
