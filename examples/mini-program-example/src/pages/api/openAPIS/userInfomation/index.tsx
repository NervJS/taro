import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 开放接口-用户信息
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getUserProfile',
        inputData: {
          desc: '空实现',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.getUserProfile')
          Taro.getUserProfile(data).then((res) => {
            TestConsole.consoleNormal('getUserProfile', res)
          })
          Taro.getUserProfile({
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
        id: 'getUserInfo',
        inputData: {
          withCredentials: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.getUserInfo')
          Taro.getUserInfo({
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
        id: 'UserInfo',
        func: null,
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
