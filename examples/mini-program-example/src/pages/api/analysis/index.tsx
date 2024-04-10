import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 数据分析
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'reportMonitor',
        func: null,
      },
      {
        id: 'reportEvent',
        func: null,
      },
      {
        id: 'reportAnalytics',
        inputData: {
          eventName: '',
          data: {},
        },
        func: (apiIndex, inData) => {
          TestConsole.consoleTest('reportAnalytics')
          Taro.reportAnalytics(inData.eventName, inData.data)
        },
      },
      {
        id: 'getExptInfoSync',
        inputData: {
          key: [],
        },
        func: (apiIndex, inData) => {
          TestConsole.consoleTest('getExptInfoSync')
          Taro.getExptInfoSync(inData.key)
        },
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
