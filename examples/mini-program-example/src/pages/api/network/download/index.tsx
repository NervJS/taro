import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-导航栏
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'showNavigationBarLoading',
        func: null,
      },
      {
        id: 'setNavigationBarTitle',
        func: null,
      },
      {
        id: 'setNavigationBarColor',
        func: null,
      },
      {
        id: 'hideNavigationBarLoading',
        func: null,
      },
      {
        id: 'hideHomeButton',
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
