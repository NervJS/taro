import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-蓝牙-通用
 * @returns
 */
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopBluetoothDevicesDiscovery',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopBluetoothDevicesDiscovery')
          this.stopBluetoothDevicesDiscovery()
          // Taro.stopBluetoothDevicesDiscovery({
          //   success: (res) => {
          //     TestConsole.consoleSuccess(res)
          //   },
          //   fail: (res) => {
          //     TestConsole.consoleFail(res)
          //   },
          //   complete: (res) => {
          //     TestConsole.consoleComplete(res)
          //   },
          // }).then((res) => {
          //   TestConsole.consoleReturn({ errMsg: res.errMsg })
          // })
        },
      },
      {
        id: 'openBluetoothAdapter',
        func: (apiIndex) => {
          this.openBluetoothAdapter()
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
        func: (apiIndex) => {
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
        func: (apiIndex) => {
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
        func: (apiIndex) => {
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
        func: (apiIndex) => {
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
    devices: []
  }
  _discoveryStarted = false

  getUuid = (e) => {
    let deviceUuid = e.detail.value + ''
    this.setState({
      deviceUuid,
    })
  }
  openBluetoothAdapter = () => {
    Taro.openBluetoothAdapter({
      success: (res) => {
        TestConsole.consoleSuccess(res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        TestConsole.consoleFail(res)
        if (res.errCode === 10001) {
          Taro.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
          Taro.onBluetoothAdapterStateChange((res) => {
            if (res && res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  }
  startBluetoothDevicesDiscovery = () => {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    Taro.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        TestConsole.consoleSuccess(res)
        this.onBluetoothDeviceFound()
      },
    })
  }
  stopBluetoothDevicesDiscovery() {
    Taro.stopBluetoothDevicesDiscovery({
      complete: () => {
        this._discoveryStarted = false
      }
    })
  }

  onBluetoothDeviceFound = () => {
    Taro.onBluetoothDeviceFound((res) => {
      console.log(res.devices)
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.state.devices as any
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        if (idx === -1) {
          foundDevices.push(device)
        } else {
          foundDevices[idx] = device
        }
        this.setState(
          {
            devices: foundDevices,
          }
        )
      })
    })
  }

  render() {
    const { list, devices } = this.state
    return (
      <View className='api-page'>
        <View className="page-body-info">
        <ScrollView className="device_list" scrollY scrollWithAnimation>
          {
            devices.map((item: any, index) => {
              return (
                <View className="device_item" key={index}>
                  <View>{item.name}</View>
                  <View>信号强度: {item.RSSI}dBm ({Math.max(0, item.RSSI + 100)}%)</View>
                  <View>UUID: {item.deviceId}</View>
                  <View>Service数量: {item.advertisServiceUUIDs.length}</View>
                </View>

              )
            })
          }
        </ScrollView>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}

// export default class Index extends React.Component {
//   state = {
//     list: [
//       {
//         id: 'stopBluetoothDevicesDiscovery',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('stopBluetoothDevicesDiscovery')
//           Taro.stopBluetoothDevicesDiscovery({
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn({ errMsg: res.errMsg })
//           })
//         },
//       },
//       {
//         id: 'startBluetoothDevicesDiscovery',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('startBluetoothDevicesDiscovery')
//           const { deviceUuid } = this.state
//           let services: Array<string> = []
//           if (deviceUuid != '') {
//             services.push(deviceUuid)
//           }
//           Taro.startBluetoothDevicesDiscovery({
//             allowDuplicatesKey: false,
//             interval: 0,
//             services,
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn({ errMsg: res.errMsg })
//           })
//         },
//       },
//       {
//         id: 'openBluetoothAdapter',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('openBluetoothAdapter')
//           Taro.openBluetoothAdapter({
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn({ errMsg: res.errMsg })
//           })
//         },
//       },
//       {
//         id: 'onBluetoothDeviceFound',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('onBluetoothDeviceFound')
//           Taro.onBluetoothDeviceFound((res) => {
//             TestConsole.consoleSuccess(res)
//           })
//         },
//       },
//       {
//         id: 'onBluetoothAdapterStateChange',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('onBluetoothAdapterStateChange')
//           Taro.onBluetoothAdapterStateChange((res) => {
//             TestConsole.consoleSuccess(res)
//           })
//         },
//       },
//       {
//         id: 'offBluetoothDeviceFound',
//         func: null,
//       },
//       {
//         id: 'offBluetoothAdapterStateChange',
//         func: null,
//       },
//       {
//         id: 'makeBluetoothPair',
//         func: null,
//       },
//       {
//         id: 'isBluetoothDevicePaired',
//         func: null,
//       },
//       {
//         id: 'getConnectedBluetoothDevices',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('getConnectedBluetoothDevices')
//           const { deviceUuid } = this.state
//           if (deviceUuid == '') {
//             Taro.showToast({
//               title: '请输入设备uuid',
//             })
//             return
//           }
//           let services: Array<string> = [deviceUuid]
//           Taro.getConnectedBluetoothDevices({
//             services,
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn(res)
//           })
//         },
//       },
//       {
//         id: 'getBluetoothDevices',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('getBluetoothDevices')
//           Taro.getBluetoothDevices({
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn(res)
//           })
//         },
//       },
//       {
//         id: 'getBluetoothAdapterState',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('getBluetoothAdapterState')
//           Taro.getBluetoothAdapterState({
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn(res)
//           })
//         },
//       },
//       {
//         id: 'closeBluetoothAdapter',
//         func: (apiIndex) => {
//           TestConsole.consoleTest('closeBluetoothAdapter')
//           Taro.closeBluetoothAdapter({
//             success: (res) => {
//               TestConsole.consoleSuccess(res)
//             },
//             fail: (res) => {
//               TestConsole.consoleFail(res)
//             },
//             complete: (res) => {
//               TestConsole.consoleComplete(res)
//             },
//           }).then((res) => {
//             TestConsole.consoleReturn({ errMsg: res.errMsg })
//           })
//         },
//       },
//     ],
//     deviceUuid: '',
//   }

//   getUuid = (e) => {
//     let deviceUuid = e.detail.value + ''
//     this.setState({
//       deviceUuid,
//     })
//   }

//   render() {
//     const { list } = this.state
//     return (
//       <View className='api-page'>
//         <View>
//           顺序: openBluetoothAdapter-startBluetoothDevicesDiscovery-onBluetoothDeviceFound-stopBluetoothDevicesDiscovery
//         </View>
//         <View className='api-form-info'>
//           请输入uuid: <Input onInput={this.getUuid}></Input>
//         </View>
//         <ButtonList buttonList={list} />
//       </View>
//     )
//   }
// }
