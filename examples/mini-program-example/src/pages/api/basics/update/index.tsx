import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 基础-更新
 * @returns
 */
let UpdateManager;
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'updateWeChatApp',
        func: null,
      },
      {
        id: 'getUpdateManager',
        func: () => {
          TestConsole.consoleTest('getUpdateManager')
          UpdateManager = Taro.getUpdateManager()
          TestConsole.consoleNormal('getUpdateManager', UpdateManager)
        },
      },
      {
        id: 'UpdateManager-applyUpdate',
        func: () => {
          TestConsole.consoleTest('UpdateManager-applyUpdate')
          UpdateManager.applyUpdate()
        },
      },
      {
        id: 'UpdateManager-onCheckForUpdate',
        func: () => {
          TestConsole.consoleTest('UpdateManager-onCheckForUpdate')
          UpdateManager.onCheckForUpdate((res) => {
            TestConsole.consoleNormal('UpdateManager-onCheckForUpdate', res)
          })
        },
      },
      {
        id: 'UpdateManager-onUpdateReady',
        func: () => {
          TestConsole.consoleTest('UpdateManager-onUpdateReady')
          UpdateManager.onUpdateReady((res) => {
            TestConsole.consoleNormal('UpdateManager-onUpdateReady', res)
          })
        },
      },
      {
        id: 'UpdateManager-onUpdateFailed',
        func: () => {
          TestConsole.consoleTest('UpdateManager-onUpdateFailed')
          UpdateManager.onUpdateFailed((res) => {
            TestConsole.consoleNormal('UpdateManager-onUpdateFailed', res)
          })
        },
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
