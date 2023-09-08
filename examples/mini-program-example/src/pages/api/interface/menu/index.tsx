import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-菜单
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getMenuButtonBoundingClientRect',
        func: () => {
          TestConsole.consoleTest('Taro.getMenuButtonBoundingClientRect')
          const rect = Taro.getMenuButtonBoundingClientRect()
          TestConsole.consoleNormal('getMenuButtonBoundingClientRect', rect)
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
