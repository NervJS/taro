import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'


/**
 * 基础-性能
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'reportPerformance',
        func: null,
      },
      {
        id: 'getPerformance',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getPerformance')
          const performance = Taro.getPerformance()
          TestConsole.consoleSuccess.call(this, performance, apiIndex)
        },
      },
      {
        id: 'EntryList',
        func: null,
      },
      {
        id: 'Performance',
        func: null,
      },
      {
        id: 'PerformanceEntry',
        func: null,
      },
      {
        id: 'PerformanceObserver',
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
