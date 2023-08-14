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
        func: () => {
          TestConsole.consoleTest('Taro.onKeyboardHeightChange')
          Taro.onKeyboardHeightChange(this.boardHgiehtChaget)
        },
      },
      {
        id: 'offKeyboardHeightChange',
        func: () => {
          TestConsole.consoleTest('Taro.offKeyboardHeightChange ')
          Taro.offKeyboardHeightChange(this.boardHgiehtChaget)
        },
      },
      {
        id: 'hideKeyboard',
        func: () => {
          TestConsole.consoleTest('Taro.hideKeyboard ')
          Taro.hideKeyboard({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getSelectedTextRange',
        func: () => {
          TestConsole.consoleTest('Taro.getSelectedTextRange ')
          Taro.getSelectedTextRange({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
    ],
  }

  boardHgiehtChaget = (res) => {
    TestConsole.consoleSuccess(JSON.stringify(res))
  }
  inputFocus = (e) => {
    // console.log(this.state.list[3])
    // this.state.list[3].func()
  }
  hideKeyboard = (e) => {
    let inputValue = e.detail.value + ''
    if (inputValue == 'hide') {
      this.state.list[2].func()
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
