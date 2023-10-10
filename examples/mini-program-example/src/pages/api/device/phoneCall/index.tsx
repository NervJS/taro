import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-电话
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'makePhoneCall',
        inputData: {
          phoneNumber: '13352354363',
        },
        func: (apiIndex, data) => {
          const { phoneNumber } = data
          TestConsole.consoleTest('makePhoneCall')
          Taro.makePhoneCall({
            phoneNumber,
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
            TestConsole.consoleResult.call(this, res, apiIndex)
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
