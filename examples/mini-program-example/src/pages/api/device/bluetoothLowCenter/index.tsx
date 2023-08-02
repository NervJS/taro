import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '../../../../util/util'
import './index.scss'

/**
 * 设备-蓝牙-低功耗中心设备
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'writeBLECharacteristicValue',
        func: () => {
          TestConsole.consoleTest('writeBLECharacteristicValue')
          // 向蓝牙设备发送一个0x00的16进制数据
          let buffer = new ArrayBuffer(1)
          Taro.writeBLECharacteristicValue({
            characteristicId: '',
            deviceId: '',
            serviceId: '',
            value: buffer,
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
        id: 'setBLEMTU',
        func: () => {
          TestConsole.consoleTest('setBLEMTU')
          Taro.setBLEMTU({
            deviceId: '',
            mtu: 300,
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
        id: 'readBLECharacteristicValue',
        func: () => {
          TestConsole.consoleTest('readBLECharacteristicValue')
          Taro.readBLECharacteristicValue({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: '',
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
        id: 'onBLEMTUChange',
        func: null,
      },
      {
        id: 'onBLEConnectionStateChange',
        func: () => {
          TestConsole.consoleTest('onBLEConnectionStateChange')
          Taro.onBLEConnectionStateChange((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'onBLECharacteristicValueChange',
        func: () => {
          TestConsole.consoleTest('onBLECharacteristicValueChange')
          Taro.onBLECharacteristicValueChange((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'offBLEMTUChange',
        func: null,
      },
      {
        id: 'offBLEConnectionStateChange',
        func: null,
      },
      {
        id: 'offBLECharacteristicValueChange',
        func: null,
      },
      {
        id: 'notifyBLECharacteristicValueChange',
        func: () => {
          TestConsole.consoleTest('notifyBLECharacteristicValueChange')
          Taro.notifyBLECharacteristicValueChange({
            // 启用 notify 功能
            state: true,
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: '',
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
        id: 'getBLEMTU',
        func: null,
      },
      {
        id: 'getBLEDeviceServices',
        func: () => {
          TestConsole.consoleTest('getBLEDeviceServices')
          Taro.getBLEDeviceServices({
            deviceId: '',
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
        id: 'getBLEDeviceRSSI',
        func: () => {
          TestConsole.consoleTest('getBLEDeviceRSSI')
          Taro.getBLEDeviceRSSI({
            deviceId: '',
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
        id: 'getBLEDeviceCharacteristics',
        func: () => {
          TestConsole.consoleTest('getBLEDeviceCharacteristics')
          Taro.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
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
        id: 'createBLEConnection',
        func: () => {
          TestConsole.consoleTest('createBLEConnection')
          Taro.createBLEConnection({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
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
        id: 'closeBLEConnection',
        func: () => {
          TestConsole.consoleTest('closeBLEConnection')
          Taro.closeBLEConnection({
            deviceId: '',
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
