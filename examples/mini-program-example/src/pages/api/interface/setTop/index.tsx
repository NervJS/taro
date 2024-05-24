import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-置顶
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setTopBarText',
        inputData: {
          text: 'hello, world!',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.setTopBarText')
          Taro.setTopBarText({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
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
