import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 基础-调试
 * @returns
 */
let realtimeLogManager
let logManager
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setEnableDebug',
        func: () => {
          TestConsole.consoleTest('setEnableDebug')
          Taro.setEnableDebug({
            enableDebug: true,
            success(res) {
              TestConsole.consoleSuccess(res)
            },
            fail(res) {
              TestConsole.consoleFail(res)
            },
            complete(res) {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleResult(res)
          })
        },
      },
      {
        id: 'getRealtimeLogManager',
        func: () => {
          realtimeLogManager = Taro.getRealtimeLogManager()
          TestConsole.consoleNormal('setEnableDebug', realtimeLogManager)
        },
      },
      {
        id: 'RealtimeLogManager-addFilterMsg',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-addFilterMsg')
          realtimeLogManager.addFilterMsg('test')
        },
      },
      {
        id: 'RealtimeLogManager-in',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-in')
          realtimeLogManager.in(Taro.getCurrentPages())
        },
      },
      {
        id: 'RealtimeLogManager-error',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-error')
          realtimeLogManager.error('test', ['test'])
        },
      },
      {
        id: 'RealtimeLogManager-info',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-info')
          realtimeLogManager.info(['test'])
        },
      },
      {
        id: 'RealtimeLogManager-setFilterMsg',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-setFilterMsg')
          realtimeLogManager.setFilterMsg('test')
        },
      },
      {
        id: 'RealtimeLogManager-warn',
        func: () => {
          TestConsole.consoleNormal('RealtimeLogManager-warn')
          realtimeLogManager.warn('test', ['test'])
        },
      },
      {
        id: 'RealtimeLogManager-tag',
        func: () => {
          let realtimeTagLogManage = realtimeLogManager.tag('test')
          TestConsole.consoleNormal('RealtimeLogManager-tag', realtimeTagLogManage)
        },
      },
      {
        id: 'getLogManager',
        func: () => {
          logManager = Taro.getLogManager()
          TestConsole.consoleNormal('getLogManager', logManager)
        },
      },
      {
        id: 'LogManager-debug',
        func: () => {
          logManager.debug(['test'])
          TestConsole.consoleNormal('LogManager-debug')
        },
      },
      {
        id: 'LogManager-info',
        func: () => {
          logManager.info(['test'])
          TestConsole.consoleNormal('LogManager-info')
        },
      },
      {
        id: 'LogManager-log',
        func: () => {
          logManager.log(['test'])
          TestConsole.consoleNormal('LogManager-log')
        },
      },
      {
        id: 'LogManager-warn',
        func: () => {
          logManager.warn(['test'])
          TestConsole.consoleNormal('LogManager-warn')
        },
      },
      {
        id: 'console',
        func: null,
      },
      {
        id: 'RealtimeTagLogManager',
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
