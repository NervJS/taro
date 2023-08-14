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
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.stopCompass')
          Taro.stopCompass({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'startCompass',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.startCompass')
          Taro.startCompass({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'onCompassChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onCompassChange')
          Taro.onCompassChange(this.callback)
        },
      },
      {
        id: 'offCompassChange',
        func: (apiIndex) => {
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
