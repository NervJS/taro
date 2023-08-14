import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-电话
 * @returns
 */

export default class Index extends React.Component {
  state = {
    api: {
      id: 'makePhoneCall',
      func: (inputValue) => {
        TestConsole.consoleTest('makePhoneCall')
        Taro.makePhoneCall({
          phoneNumber: inputValue,
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
    inputValue: '',
    disabled: true,
  }
  changeNumber = (e) => {
    let inputValue = e.detail.value + ''
    console.log(this)
    if (inputValue.length > 0) {
      this.setState({
        inputValue,
        disabled: false,
      })
    } else {
      this.setState({
        inputValue,
        disabled: true,
      })
    }
  }
  render() {
    const { api, inputValue, disabled } = this.state
    return (
      <View className='api-page'>
        <View>请在下方输入电话号码</View>
        <Input type='number' name='input' onInput={this.changeNumber} />
        <View
          className='api-page-btn'
          onClick={
            disabled
              ? () => {
                  Taro.showToast({
                    title: '请输入手机号码',
                    icon: 'error',
                  })
                }
              : () => {
                  api.func(inputValue)
                }
          }
        >
          {api.id}
          {api.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
        </View>
      </View>
    )
  }
}
