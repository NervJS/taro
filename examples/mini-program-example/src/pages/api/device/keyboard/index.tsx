import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-键盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onKeyboardHeightChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onKeyboardHeightChange')
          Taro.onKeyboardHeightChange(this.onBoardHgiehtChange01)
          Taro.onKeyboardHeightChange(this.onBoardHgiehtChange02)
        },
      },
      {
        id: 'offKeyboardHeightChange',
        inputData: {
          closeAll: false,
          close01: true,
          close02: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.offKeyboardHeightChange ')
          if (data.closeAll) {
            Taro.offKeyboardHeightChange()
          } else {
            if (data.close01) {
              Taro.offKeyboardHeightChange(this.onBoardHgiehtChange01)
            }
            if (data.close02) {
              Taro.offKeyboardHeightChange(this.onBoardHgiehtChange02)
            }
          }
        },
      },
      {
        id: 'hideKeyboard',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.hideKeyboard ')
          Taro.hideKeyboard({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleReturn.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'getSelectedTextRange',
        func: null,
      },
    ],
  }

  onBoardHgiehtChange01 = (res: any) => {
    TestConsole.consoleOnCallback(res, 'onKeyboardHeightChange01')
  }

  onBoardHgiehtChange02 = (res: any) => {
    TestConsole.consoleOnCallback(res, 'onKeyboardHeightChange02')
  }

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View>点击输入框拉起键盘</View>
        <Input></Input>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
