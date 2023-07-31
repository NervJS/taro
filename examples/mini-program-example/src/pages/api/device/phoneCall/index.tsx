import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
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
        Taro.makePhoneCall({
          phoneNumber: inputValue,
          success: (res) => {
            console.log('success-----', res)
          },
          fail: (res) => {
            console.log('fail-----', res)
          },
          complete: (res) => {
            console.log('complete-----', res)
          },
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
        <Button
          className='api-page-btn'
          type='primary'
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
        </Button>
      </View>
    )
  }
}
