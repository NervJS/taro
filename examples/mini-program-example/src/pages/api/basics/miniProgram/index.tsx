import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import LifeCycle from './lifeCycle/index'
import ApplicationLevelEvents from './applicationLevelEvents/index'
import './index.scss'

/**
 * 基础-小程序
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'lifeCycle',
        func: () => {
          this.setState({
            showAPI: 'lifeCycle',
          })
        },
      },
      {
        id: 'applicationLevelEvents',
        func: () => {
          this.setState({
            showAPI: 'applicationLevelEvents',
          })
        },
      },
    ],
    showAPI: '',
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
        {this.state.showAPI == 'lifeCycle' ? (
          <LifeCycle />
        ) : this.state.showAPI == 'applicationLevelEvents' ? (
          <ApplicationLevelEvents />
        ) : (
          ''
        )}
      </View>
    )
  }
}
