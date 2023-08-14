import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-网络
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onNetworkWeakChange',
        func: null,
      },
      {
        id: 'onNetworkStatusChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onNetworkStatusChange')
          Taro.onNetworkStatusChange(this.callback)
        },
      },
      {
        id: 'offNetworkWeakChange',
        func: null,
      },
      {
        id: 'offNetworkStatusChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('offNetworkStatusChange')
          Taro.offNetworkStatusChange(this.callback)
        },
      },
      {
        id: 'getNetworkType',
        func: (apiIndex) => {
          TestConsole.consoleTest('getNetworkType')
          Taro.getNetworkType({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              this.setState({
                networkType: res.networkType
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              this.setState({
                networkType: '获取失败'
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getLocalIPAddress',
        func: null,
      },
    ],
    networkType: '未获取',
    networkState: null
  }

  callback = (res: any) => {
    TestConsole.consoleSuccess(res)
    this.setState({
      networkState: res.isConnected,
      networkType: res.networkType
    })
  }

  render() {
    let { list, networkType, networkState } = this.state
    return (
      <View className='api-page'>
        <View style={{display:'inline-block'}}>
          <View>网络类型：{networkType}</View>
          <View hidden={networkState == null ? false : true}>网络状态：未获取</View>
          <View hidden={networkState == null ? true : false}>网络状态：{networkState ? '已连接' : '已断开'}</View>
        </View>
        {list.map((item) => {
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
