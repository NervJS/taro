import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-罗盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopCompass',
        func: () => {
          TestConsole.consoleTest('Taro.stopCompass')
          Taro.stopCompass({
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
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'startCompass',
        func: () => {
          TestConsole.consoleTest('Taro.startCompass')
          Taro.startCompass({
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
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'onCompassChange',
        func: () => {
          TestConsole.consoleTest('Taro.onCompassChange')
          Taro.onCompassChange(this.callback)
        },
      },
      {
        id: 'offCompassChange',
        func: () => {
          TestConsole.consoleTest('Taro.offCompassChange')
          Taro.offCompassChange(this.callback)
        },
      },
    ],
  }

  callback = (res) => {
    console.log(res)
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
