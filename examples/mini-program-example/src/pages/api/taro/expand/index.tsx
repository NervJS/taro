import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * Taro-拓展
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'eventCenter',
        func: null,
      },
      {
        id: 'getEnv',
        func: () => {
          TestConsole.consoleTest('Taro.getEnv')
          TestConsole.consoleNormal('Taro.getEnv', Taro.getEnv())
        },
      },
      {
        id: 'pxTransform',
        func: null,
      },
      {
        id: 'initPxTransform',
        func: null,
      },
      {
        id: 'getAppInfo',
        func: null,
      },
      {
        id: 'getRenderer',
        func: null,
      },
      {
        id: 'requirePlugin',
        func: () => {
          let pluginName = Taro.requirePlugin('test')
          TestConsole.consoleNormal('requirePlugin', pluginName)
        },
      },
      {
        id: 'getCurrentInstance',
        func: null,
      },
      {
        id: 'setGlobalDataPlugin',
        func: null,
      },
      {
        id: 'getTabBar',
        func: null,
      },
      {
        id: 'interceptorify',
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
