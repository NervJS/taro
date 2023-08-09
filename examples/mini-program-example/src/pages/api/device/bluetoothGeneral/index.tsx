import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
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
          const { deviceUuid } = this.state
          let services: Array<string> = []
          if (deviceUuid != '') {
            services.push(deviceUuid)
          }
          Taro.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
            interval: 0,
            services,
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
          const { deviceUuid } = this.state
          if (deviceUuid == '') {
            Taro.showToast({
              title: '请输入设备uuid',
            })
            return
          }
          let services: Array<string> = [deviceUuid]
          Taro.getConnectedBluetoothDevices({
            services,
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
    deviceUuid: '',
  }

  getUuid = (e) => {
    let deviceUuid = e.detail.value + ''
    this.setState({
      deviceUuid,
    })
  }

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View>
          顺序: openBluetoothAdapter-startBluetoothDevicesDiscovery-onBluetoothDeviceFound-stopBluetoothDevicesDiscovery
        </View>
        <View className='api-form-info'>
          请输入uuid: <Input onInput={this.getUuid}></Input>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
