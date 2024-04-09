import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'

/**
 * 基础-生命周期
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getLaunchOptionsSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getLaunchOptionsSync')
          const options = Taro.getLaunchOptionsSync()
          TestConsole.consoleResult.call(this, options, apiIndex)
        },
      },
      {
        id: 'getEnterOptionsSync',
        func: () => {
          TestConsole.consoleTest('Taro.getEnterOptionsSync')
          const options = Taro.getEnterOptionsSync()
          TestConsole.consoleNormal('getEnterOptionsSync', options)
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
