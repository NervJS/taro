import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '../../../../util/util'
import './index.scss'

/**
 * 设备-蓝牙-通用
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopBluetoothDevicesDiscovery',
        func: () => {
          TestConsole.consoleTest('stopBluetoothDevicesDiscovery')
          Taro.stopBluetoothDevicesDiscovery({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn({ errMsg: res.errMsg })
          })
        },
      },
      {
        id: 'startBluetoothDevicesDiscovery',
        func: () => {
          TestConsole.consoleTest('startBluetoothDevicesDiscovery')
          Taro.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
            interval: 0,
            services: [],
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn({ errMsg: res.errMsg })
          })
        },
      },
      {
        id: 'openBluetoothAdapter',
        func: () => {
          TestConsole.consoleTest('openBluetoothAdapter')
          Taro.openBluetoothAdapter({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn({ errMsg: res.errMsg })
          })
        },
      },
      {
        id: 'onBluetoothDeviceFound',
        func: () => {
          TestConsole.consoleTest('onBluetoothDeviceFound')
          Taro.onBluetoothDeviceFound((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'onBluetoothAdapterStateChange',
        func: () => {
          TestConsole.consoleTest('onBluetoothAdapterStateChange')
          Taro.onBluetoothAdapterStateChange((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'offBluetoothDeviceFound',
        func: null,
      },
      {
        id: 'offBluetoothAdapterStateChange',
        func: null,
      },
      {
        id: 'makeBluetoothPair',
        func: null,
      },
      {
        id: 'isBluetoothDevicePaired',
        func: null,
      },
      {
        id: 'getConnectedBluetoothDevices',
        func: () => {
          TestConsole.consoleTest('getConnectedBluetoothDevices')
          Taro.getConnectedBluetoothDevices({
            services: [],
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getBluetoothDevices',
        func: () => {
          TestConsole.consoleTest('getBluetoothDevices')
          Taro.getBluetoothDevices({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getBluetoothAdapterState',
        func: () => {
          TestConsole.consoleTest('getBluetoothAdapterState')
          Taro.getBluetoothAdapterState({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'closeBluetoothAdapter',
        func: () => {
          TestConsole.consoleTest('closeBluetoothAdapter')
          Taro.closeBluetoothAdapter({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn({ errMsg: res.errMsg })
          })
        },
      },
    ],
  }

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View>
          顺序: openBluetoothAdapter-startBluetoothDevicesDiscovery-onBluetoothDeviceFound-stopBluetoothDevicesDiscovery
        </View>
        {list.map((item) => {
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
