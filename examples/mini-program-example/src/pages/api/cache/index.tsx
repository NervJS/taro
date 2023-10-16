import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 数据缓存
 * @returns
 */
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setStorageSync',
        inputData: {
          key: 'setStorageSyncKey',
          value: 'setStorageSyncValue',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setStorageSync')
          const { key, value } = data
          Taro.setStorageSync(key, value)
        },
      },
      {
        id: 'setStorage',
        inputData: {
          key: 'setStorageKey',
          value: 'setStorageValue',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setStorage')
          const { key, value } = data
          Taro.setStorage({
            key: key,
            data: value,
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
      {
        id: 'revokeBufferURL_暂不支持',
        func: null,
      },
      {
        id: 'removeStorageSync',
        inputData: {
          key: 'setStorageKey',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('removeStorageSync')
          const { key } = data
          Taro.removeStorageSync(key)
        },
      },
      {
        id: 'removeStorage',
        inputData: {
          key: 'setStorageKey',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('removeStorage')
          const { key } = data
          Taro.removeStorage({
            key,
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
      {
        id: 'getStorageSync',
        inputData: {
          key: 'setStorageKey',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getStorageSync')
          const { key } = data
          let value = Taro.getStorageSync(key)
          TestConsole.consoleResult.call(this, value, apiIndex)
        },
      },
      {
        id: 'getStorage',
        inputData: {
          key: 'setStorageKey',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getStorage')
          const { key } = data
          Taro.getStorage({
            key,
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
      {
        id: 'getStorageInfoSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('getStorageInfoSync')
          const res = Taro.getStorageInfoSync()
          TestConsole.consoleResult.call(this, res, apiIndex)
        },
      },
      {
        id: 'getStorageInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('getStorageInfo')
          Taro.getStorageInfo({
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
      {
        id: 'createBufferURL_暂不支持',
        func: null,
      },
      {
        id: 'clearStorageSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('clearStorageSync')
          let res = Taro.clearStorageSync()
          TestConsole.consoleResult.call(this, res, apiIndex)
        },
      },
      {
        id: 'clearStorage',
        func: (apiIndex) => {
          TestConsole.consoleTest('clearStorage')
          Taro.clearStorage({
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
      {
        id: 'PeriodicUpdate_暂不支持',
        func: null,
      },
      {
        id: 'setBackgroundFetchToken',
        inputData: {
          token: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setBackgroundFetchToken')
          Taro.setBackgroundFetchToken({
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
        id: 'getBackgroundFetchData',
        inputData: {
          fetchType: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getBackgroundFetchData')
          Taro.getBackgroundFetchData({
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
        id: 'CacheManager_暂不支持',
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
