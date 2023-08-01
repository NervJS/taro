import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-自定义组件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'nextTick',
        func: () => {
          let data = 0 // 直接在当前同步流程中执行
          Taro.nextTick(() => {
            data = 1 // 在当前同步流程结束后，下一个时间片执行
          })
          data = 2 // 直接在当前同步流程中执行
          console.log('nextTick success ', data)
        },
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
