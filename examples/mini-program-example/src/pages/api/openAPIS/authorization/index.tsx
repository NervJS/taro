import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 开放接口-授权
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'authorizeForMiniProgram',
        inputData: {
          scope: 'scope.record',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.authorizeForMiniProgram')
          Taro.authorizeForMiniProgram({
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
        id: 'authorize',
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
