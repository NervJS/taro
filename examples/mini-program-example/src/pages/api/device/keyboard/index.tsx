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
          Taro.onKeyboardHeightChange(this.boardHgiehtChaget)
        },
      },
      {
        id: 'offKeyboardHeightChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offKeyboardHeightChange ')
          Taro.offKeyboardHeightChange(this.boardHgiehtChaget)
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
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'getSelectedTextRange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getSelectedTextRange ')
          Taro.getSelectedTextRange({
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
    ],
  }

  boardHgiehtChaget = (res) => {
    TestConsole.consoleSuccess(res)
  }
  inputFocus = (e) => {
    // console.log(this.state.list[3])
    // this.state.list[3].func()
  }
  hideKeyboard = (e) => {
    let inputValue = e.detail.value + ''
    if (inputValue == 'hide') {
      this.state.list[2].func(2)
    }
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View>点击输入框拉起键盘</View>
        <Input onFocus={this.inputFocus} onInput={this.hideKeyboard}></Input>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
