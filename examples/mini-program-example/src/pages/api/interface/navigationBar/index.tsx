import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-导航栏
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'showNavigationBarLoading',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.showNavigationBarLoading')
          Taro.showNavigationBarLoading({
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
      {
        id: 'hideNavigationBarLoading',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.hideNavigationBarLoading')
          Taro.hideNavigationBarLoading({
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
      {
        id: 'setNavigationBarTitle',
        inputData: {
          title: '当前页面',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.setNavigationBarTitle')
          Taro.setNavigationBarTitle({
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
      {
        id: 'setNavigationBarColor',
        inputData: {
          frontColor: '#000000',
          backgroundColor: '#04305f',
          animation: {
            duration: 2000,
            timingFunc: 'easeIn',
          },
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.setNavigationBarColor')
          Taro.setNavigationBarColor({
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
      {
        id: 'hideHomeButton',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.hideHomeButton')
          Taro.hideHomeButton().then(() => {
            TestConsole.consoleNormal('hideHomeButton')
          })
          Taro.hideHomeButton({
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
