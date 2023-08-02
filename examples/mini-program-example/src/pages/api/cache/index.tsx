import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from 'src/util/util'

/**
 * 数据缓存
 * @returns
 */
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setStorageSync',
        func: () => {
          TestConsole.consoleTest('setStorageSync')
          Taro.setStorageSync('setStorageSyncKey', 'setStorageSyncValue')
        },
      },
      {
        id: 'setStorage',
        func: () => {
          TestConsole.consoleTest('setStorage')
          Taro.setStorage({
            data: 'setStorageValue',
            key: 'setStorageKey',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'revokeBufferURL_暂不支持',
        func: null,
      },
      {
        id: 'removeStorageSync',
        func: () => {
          TestConsole.consoleTest('removeStorageSync')
          Taro.removeStorageSync('setStorageSyncKey')
          TestConsole.consoleNormal('removeStorageSync success')
        },
      },
      {
        id: 'removeStorage',
        func: () => {
          TestConsole.consoleTest('removeStorage')
          Taro.removeStorage({
            key: 'setStorageKey',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getStorageSync',
        func: () => {
          TestConsole.consoleTest('getStorageSync')
          try {
            var value = Taro.getStorageSync('setStorageSyncKey')
            if (value) {
              TestConsole.consoleNormal('getStorageSync value ', value)
            }
          } catch (e) {
            TestConsole.consoleNormal('getStorageSync error ', e)
          }
        },
      },
      {
        id: 'getStorageInfoSync',
        func: () => {
          TestConsole.consoleTest('getStorageInfoSync')
          try {
            const res = Taro.getStorageInfoSync()
            TestConsole.consoleNormal('getStorageInfoSync result:', res)
          } catch (e) {
            TestConsole.consoleNormal('getStorageInfoSync error ', e)
          }
        },
      },
      {
        id: 'getStorageInfo',
        func: () => {
          TestConsole.consoleTest('getStorageInfo')
          Taro.getStorageInfo({
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getStorage',
        func: () => {
          TestConsole.consoleTest('getStorage')
          Taro.getStorage({
            key: 'setStorageKey',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'createBufferURL_暂不支持',
        func: null,
      },
      {
        id: 'clearStorageSync',
        func: () => {
          TestConsole.consoleTest('clearStorageSync')
          try {
            Taro.clearStorageSync()
            TestConsole.consoleNormal('clearStorageSync success')
          } catch (e) {
            // Do something when catch error
            TestConsole.consoleNormal('clearStorageSync error ', e)
          }
        },
      },
      {
        id: 'clearStorage',
        func: () => {
          TestConsole.consoleTest('clearStorage')
          Taro.clearStorage({
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'PeriodicUpdate_暂不支持',
        func: null,
      },
      {
        id: 'CacheManager_暂不支持',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
