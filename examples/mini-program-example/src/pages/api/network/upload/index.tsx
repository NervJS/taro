import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 网络-上传
 * @returns
 */

function progressUpdate(res) {
  TestConsole.consoleNormal('onProgressUpdate', res)
}

function headersReceived(res) {
  TestConsole.consoleNormal('onHeadersReceived', res)
}

export default class Index extends React.Component {
  state = {
    task: null,
    list: [
      {
        id: 'uploadFile',
        inputData: {
          url: 'http://192.168.217.245:3000/upload',
          filePath: 'internal://cache/test.jpg',
          name: 'file',
          withCredentials: false,
        },
        func: (apiIndex, data) => {
          this.startUploadFile(apiIndex, data, 'Taro.uploadFile')
        },
      },
      {
        id: 'UploadTask',
        inputData: {
          url: 'http://192.168.217.245:3000/upload',
          filePath: 'internal://cache/test.zip',
          name: 'file',
          withCredentials: false,
        },
        func: (apiIndex, data) => {
          this.startUploadFile(apiIndex, data, 'Taro.UploadTask')
        },
      },
      {
        id: 'UploadTask.abort',
        func: () => {
          TestConsole.consoleTest('UploadTask.abort')
          if (this.state.task) {
            ;(this.state.task as Taro.UploadTask).abort()
          }
        },
      },
      {
        id: 'onProgressUpdate',
        func: () => {
          TestConsole.consoleTest('UploadTask.onProgressUpdate')
          if (this.state.task) {
            ;(this.state.task as Taro.UploadTask).onProgressUpdate(progressUpdate)
          }
        },
      },
      {
        id: 'offProgressUpdate',
        func: () => {
          TestConsole.consoleTest('UploadTask.offProgressUpdate')
          if (this.state.task) {
            ;(this.state.task as Taro.UploadTask).offProgressUpdate(progressUpdate)
          }
        },
      },
      {
        id: 'onHeadersReceived',
        func: () => {
          TestConsole.consoleTest('UploadTask.onHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.UploadTask).onHeadersReceived(headersReceived)
          }
        },
      },
      {
        id: 'offHeadersReceived',
        func: () => {
          TestConsole.consoleTest('UploadTask.offHeadersReceived')
          if (this.state.task) {
            ;(this.state.task as Taro.UploadTask).offHeadersReceived(headersReceived)
          }
        },
      },
    ],
  }

  startUploadFile(apiIndex, data, testTitle) {
    TestConsole.consoleTest(testTitle)
    const task = Taro.uploadFile({
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
      TestConsole.consoleNormal('catch UploadTask error')
    })
    this.setState({ task })
    TestConsole.consoleNormal('Taro.UploadTask', task)
    task.onProgressUpdate(progressUpdate)
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
