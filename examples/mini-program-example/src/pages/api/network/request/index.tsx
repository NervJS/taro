import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 网络-发起请求
 * @returns
 */

function headersReceived(res) {
  TestConsole.consoleNormal('onHeadersReceived', res)
}

export default class Index extends React.Component {
  state = {
    task: null,
    list: [
      {
        id: 'request',
        inputData: {
          url: 'http://192.168.217.245:3000/hello',
          dataType: 'json',
          method: 'POST',
          data: { name: 'Taro' },
          headers: {
            'Content-Type': 'application/json',
          },
        },
        func: (apiIndex, data) => {
          this.startRequest(apiIndex, data, 'Taro.request')
        },
      },
      {
        id: 'RequestTask.abort',
        func: () => {
          TestConsole.consoleTest('RequestTask.abort')
          if (this.state.task) {
            ;(this.state.task as Taro.RequestTask<any>).abort()
          }
        },
      },
      {
        id: 'onHeadersReceived',
        func: () => {
          TestConsole.consoleTest('RequestTask.onHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.RequestTask<any>).onHeadersReceived(headersReceived)
          }
        },
      },
      {
        id: 'offHeadersReceived',
        func: () => {
          TestConsole.consoleTest('RequestTask.offHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.RequestTask<any>).offHeadersReceived(headersReceived)
          }
        },
      },
      {
        id: 'addInterceptor',
        func: null,
      },
      {
        id: 'cleanInterceptors',
        func: null,
      },
    ],
  }

  startRequest(apiIndex, data, testTitle) {
    TestConsole.consoleTest(testTitle)
    const task = Taro.request({
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
    task.catch(() => {
      TestConsole.consoleNormal('catch RequestTask error')
    })
    this.setState({ task })
    TestConsole.consoleNormal('Taro.RequestTask', task)
    task.onHeadersReceived(headersReceived)
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
