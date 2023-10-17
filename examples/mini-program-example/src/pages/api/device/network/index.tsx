import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-网络
 * @returns
 */

let onNetworkStatusChangeCallback = {}

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
          Taro.onNetworkStatusChange(this.onNetworkStatusChange01)
          Taro.onNetworkStatusChange(this.onNetworkStatusChange02)
        },
      },
      {
        id: 'offNetworkWeakChange',
        func: null,
      },
      {
        id: 'offNetworkStatusChange',
        inputData: {
          closeAll: false,
          close01: true,
          close02: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('offNetworkStatusChange')
          if (data.closeAll) {
            Taro.offNetworkStatusChange()
          } else {
            if (data.close01) {
              Taro.offNetworkStatusChange(this.onNetworkStatusChange01)
            }
            if (data.close02) {
              Taro.offNetworkStatusChange(this.onNetworkStatusChange02)
            }
          }
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
                networkType: res.networkType,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              this.setState({
                networkType: '获取失败',
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
            .then((res) => {
              TestConsole.consoleResult.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleResult.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'getLocalIPAddress',
        func: null,
      },
    ],
    networkType: '未获取',
    networkState: null,
  }
  // 网络状态的订阅，H5实现，数组存储订阅函数，同一个订阅函数未做去重处理。
  onNetworkStatusChange01 = (res: any) => {
    onNetworkStatusChangeCallback['onNetworkStatusChange01'] = res
    TestConsole.consoleOnCallback.call(this, onNetworkStatusChangeCallback, 'onNetworkStatusChange01', 1)
    this.setState({
      networkState: res.isConnected,
      networkType: res.networkType,
    })
  }

  onNetworkStatusChange02 = (res: any) => {
    onNetworkStatusChangeCallback['onNetworkStatusChange02'] = res
    TestConsole.consoleOnCallback.call(this, onNetworkStatusChangeCallback, 'onNetworkStatusChange02', 1)
    this.setState({
      networkState: res.isConnected,
      networkType: res.networkType,
    })
  }

  render() {
    let { list, networkType, networkState } = this.state
    return (
      <View className='api-page'>
        <View style={{ display: 'inline-block' }}>
          <View>网络类型：{networkType}</View>
          <View hidden={networkState == null ? false : true}>网络状态：未获取</View>
          <View hidden={networkState == null ? true : false}>网络状态：{networkState ? '已连接' : '已断开'}</View>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
