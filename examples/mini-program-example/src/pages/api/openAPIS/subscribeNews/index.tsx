import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 开放接口-订阅消息
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'requestSubscribeMessage',
        inputData: {
          tmplIds: ['OTHER_TYPES', 'CONTENT_INFORMATION', 'SERVICE_INFORMATION', 'SOCIAL_COMMUNICATION'],
        },
        func: (apiIndex, data) => {
          Taro.requestSubscribeMessage({
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
        id: 'requestSubscribeDeviceMessage',
        func: null,
      },
    ],
  }
  render() {
    let { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
