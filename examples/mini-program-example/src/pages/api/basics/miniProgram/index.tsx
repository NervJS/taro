import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import LifeCycle from './lifeCycle/index'
import ApplicationLevelEvents from './applicationLevelEvents/index'
import ButtonList from '@/components/buttonList'
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
        func: (apiIndex) => {
          this.setState({
            showAPI: 'lifeCycle',
          })
        },
      },
      {
        id: 'applicationLevelEvents',
        func: (apiIndex) => {
          this.setState({
            showAPI: 'applicationLevelEvents',
          })
        },
      },
    ],
    showAPI: '',
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
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
