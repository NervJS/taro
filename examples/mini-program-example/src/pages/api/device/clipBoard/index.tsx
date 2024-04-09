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
        inputData: {
          data: '我是复制的内容',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setClipboardData')
          Taro.setClipboardData({
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
            .then((res) => {
              TestConsole.consoleResult.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleResult.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'getClipboardData',
        func: (apiIndex) => {
          TestConsole.consoleTest('getClipboardData')
          Taro.getClipboardData({
            success: (res) => {
              this.setState({
                pasted: res.data,
              })
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
              TestConsole.consoleResult.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleResult.call(this, err, apiIndex)
            })
        },
      },
    ],
    pasted: '',
  }
  render() {
    let { list, value, pasted } = this.state
    return (
      <View className='api-page'>
        <View style={{ display: 'inline-block' }}>
          <View>粘贴内容：{pasted}</View>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
