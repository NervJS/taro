import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 开放接口-账户信息
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getAccountInfoSync',
        func: () => {
          TestConsole.consoleTest('Taro.getAccountInfoSync')
          TestConsole.consoleNormal('Taro.getAccountInfoSync', Taro.getAccountInfoSync())
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
