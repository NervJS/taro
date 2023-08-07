import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-剪切板
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setClipboardData',
        func: () => {
          TestConsole.consoleTest('setClipboardData')
          Taro.setClipboardData({
            data: this.state.value,
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
        id: 'getClipboardData',
        func: () => {
          TestConsole.consoleTest('getClipboardData')
          Taro.getClipboardData({
            success: (res) => {
              TestConsole.consoleSuccess(res)
              this.setState({ pasted: res.data })
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
    value: '我是复制的内容',
    pasted: '',
  }
  render() {
    let { list, value, pasted } = this.state
    return (
      <View className='api-page'>
        <View style={{ display: 'inline-block' }}>
          <View>复制内容：{value}</View>
          <View>粘贴内容：{pasted}</View>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
