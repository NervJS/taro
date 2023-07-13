import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
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
                    Taro.stopBluetoothDevicesDiscovery({
                        success: (res) => {
                            console.log('success-----', res);
                        }
                      })
                },
            }, 
            {
                id: 'startBluetoothDevicesDiscovery',
                func: () => {
                    Taro.startBluetoothDevicesDiscovery({
                        allowDuplicatesKey: true,
                        success: (res) => {
                          console.log('startBluetoothDevicesDiscovery success', res);
                        },
                      })
                },
            },
            {
                id: 'openBluetoothAdapter',
                func: () => {
                    Taro.openBluetoothAdapter({
                        success: (res) => {
                          console.log('openBluetoothAdapter success', res);
                        },
                        fail: (res) => {
                            console.log('openBluetoothAdapter fail', res);
                        }
                      })
                },
            }, 
            {
                id: 'onBluetoothDeviceFound',
                func: () => {
                    Taro.onBluetoothDeviceFound((res) => {
                        res.devices.forEach(device => {
                          if (!device.name && !device.localName) {
                            return
                          }
                          const foundDevices = this.state.devices
                          const idx = this.inArray(foundDevices, 'deviceId', device.deviceId)
                          const data = {}
                          if (idx === -1) {
                            data[`devices[${foundDevices.length}]`] = device
                          } else {
                            data[`devices[${idx}]`] = device
                          }
                          this.setState(data)
                        })
                      })
                },
            }, 
            {
                id: 'onBluetoothAdapterStateChange',
                func: () => {
                    Taro.onBluetoothAdapterStateChange((res) => {
                        console.log('success-----', res);
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
                func: null,
            },  
            {
                id: 'getBluetoothDevices',
                func: () => {
                    Taro.getBluetoothDevices({
                        success: (res) => {
                            console.log('success-----', res);
                        }
                    })
                },
            }, 
            {
                id: 'getBluetoothAdapterState',
                func: () => {
                    Taro.getBluetoothAdapterState({
                        success: (res) => {
                            console.log('success-----', res);
                        }
                    })
                },
            }, 
            {
                id: 'closeBluetoothAdapter',
                func: () => {
                    Taro.closeBluetoothAdapter({
                        success: (res) => {
                            console.log('success-----', res);
                        }
                    })
                },
            },  
        ], 
        devices: [],
    }
    inArray = (arr, key, val) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][key] === val) {
            return i
          }
        }
        return -1
      }
    render () {
        const { list, devices } = this.state;
        return (
            <View className='api-page'>
                <View className="page-body-info">
                    <View className="devices_summary">已发现 { devices.length } 个外围设备：</View>
                    <ScrollView className="device_list" scroll-y scroll-with-animation>
                        {
                            devices.map((item, index) => {
                                return (
                                    <View 
                                        key={index}
                                        data-device-id="{{item.deviceId}}"
                                        data-name="{{item.name || item.localName}}"
                                        className="device_item"
                                    >
                                        <View style="font-size: 16px;">{ item.name }</View>
                                        <View style="font-size: 10px">信号强度: { item.RSSI }dBm ({ utils.max(0, item.RSSI + 100) }%)</View>
                                        <View style="font-size: 10px">UUID: { item.deviceId }</View>
                                        <View style="font-size: 10px">Service数量: { utils.len(item.advertisServiceUUIDs) }</View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View>顺序: openBluetoothAdapter --- startBluetoothDevicesDiscovery --- onBluetoothDeviceFound --- stopBluetoothDevicesDiscovery</View>
                {
                    list.map((item) => {
                        return (
                            <Button
                                className='api-page-btn'
                                type='primary'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </Button>
                        )
                    })
                }
            </View>
        )
    }
}
