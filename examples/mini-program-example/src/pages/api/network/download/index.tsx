import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 网络-下载
 * @returns
 */

export default class Index extends React.Component {
  state = {
    task: null,
    list: [
      {
        id: 'downloadFile',
        inputData: {
          url: 'http://172.20.10.11:3000/static/test.jpg',
          withCredentials: false,
        },
        func: (apiIndex, data) => {
          this.startDownloadFile(apiIndex, data, 'Taro.downloadFile')
        },
      },
      {
        id: 'DownloadTask',
        inputData: {
          url: 'http://172.20.10.11:3000/static/test.jpg',
          withCredentials: false,
        },
        func: (apiIndex, data) => {
          this.startDownloadFile(apiIndex, data, 'Taro.DownloadTask')
        },
      },
      {
        id: 'DownloadTask.abort',
        func: () => {
          TestConsole.consoleTest('DownloadTask.abort')
          if (this.state.task) {
            ;(this.state.task as Taro.DownloadTask).abort()
          }
        },
      },
      {
        id: 'onProgressUpdate',
        func: () => {
          TestConsole.consoleTest('DownloadTask.onProgressUpdate')
          if (this.state.task) {
            ;(this.state.task as Taro.DownloadTask).onProgressUpdate(this.progressUpdate)
          }
        },
      },
      {
        id: 'offProgressUpdate',
        func: () => {
          TestConsole.consoleTest('DownloadTask.offProgressUpdate')
          if (this.state.task) {
            ;(this.state.task as Taro.DownloadTask).offProgressUpdate(this.progressUpdate)
          }
        },
      },
      {
        id: 'onHeadersReceived',
        func: () => {
          TestConsole.consoleTest('DownloadTask.onHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.DownloadTask).onHeadersReceived(this.headersReceived)
          }
        },
      },
      {
        id: 'offHeadersReceived',
        func: () => {
          TestConsole.consoleTest('DownloadTask.offHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.DownloadTask).offHeadersReceived(this.headersReceived)
          }
        },
      },
    ],
  }
  progressUpdate = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onProgressUpdate', 3)
  }

  headersReceived = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'headersReceived', 5)
  }

  startDownloadFile(apiIndex, data, testTitle) {
    TestConsole.consoleTest(testTitle)
    const task = Taro.downloadFile({
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
      TestConsole.consoleNormal('catch DownloadTask error')
    })
    TestConsole.consoleNormal('DownloadTask', task)
    this.setState({ task })
    task.onProgressUpdate(this.progressUpdate)
    task.onHeadersReceived(this.headersReceived)
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
