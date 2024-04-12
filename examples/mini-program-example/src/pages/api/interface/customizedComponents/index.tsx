import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 界面-自定义组件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'nextTick',
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.nextTick')
          let consoleContext = 'before nextTick'
          TestConsole.consoleResult.call(this, consoleContext, apiIndex)
          Taro.nextTick(() => {
            consoleContext = 'in nextTick'
            TestConsole.consoleResult.call(this, consoleContext, apiIndex)
          })
          consoleContext = 'after nextTick'
          TestConsole.consoleResult.call(this, consoleContext, apiIndex)
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
