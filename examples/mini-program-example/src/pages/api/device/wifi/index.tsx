import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

/**
 * 设备-wifi
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopWifi',
        func: () => {
          Taro.stopWifi({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete------', res)
            },
          })
        },
      },
      {
        id: 'startWifi',
        func: () => {
          Taro.startWifi({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('fail-----', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'setWifiList',
        func: null,
      },
      {
        id: 'onWifiConnectedWithPartialInfo',
        func: () => {
          Taro.onWifiConnectedWithPartialInfo((res) => {
            console.log('success-----', res)
          })
        },
      },
      {
        id: 'onWifiConnected',
        func: () => {
          Taro.onWifiConnected((res) => {
            console.log('success-----', res)
          })
        },
      },
      {
        id: 'onGetWifiList',
        func: () => {
          Taro.onGetWifiList((res) => {
            const wifiList = res.wifiList
              .sort((a, b) => b.signalStrength - a.signalStrength)
              .map((wifi) => {
                const strength = Math.ceil(wifi.signalStrength * 4)
                return Object.assign(wifi, { strength })
              })
            this.setState({
              wifiList,
            })
          })
        },
      },
      {
        id: 'offWifiConnectedWithPartialInfo',
        func: () => {
          Taro.offWifiConnectedWithPartialInfo((res) => {
            console.log('success-----', res)
          })
        },
      },
      {
        id: 'offWifiConnected',
        func: () => {
          Taro.offWifiConnected((res) => {
            console.log('success-----', res)
          })
        },
      },
      {
        id: 'offGetWifiList',
        func: () => {
          Taro.offGetWifiList((res) => {
            console.log('success-----', res)
          })
        },
      },
      {
        id: 'getWifiList',
        func: () => {
          Taro.getWifiList({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: (res) => {
              console.log('file------', res)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'getConnectedWifi',
        func: () => {
          Taro.getConnectedWifi({
            success: (res) => {
              console.log('success-----', res)
            },
            fail(err) {
              console.error(err)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'connectWifi',
        func: () => {
          Taro.connectWifi({
            SSID: '校花的iPhone',
            BSSID: '0e:88:25:e6:77:91',
            password: 'L02281531',
            success: (res) => {
              console.log('success-----', res.errMsg)
            },
            fail(err) {
              console.log('fail-----', err)
            },
            complete: (res) => {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'WifiInfo',
        func: null,
      },
    ],
    wifiList: [],
  }
  render() {
    const { list, wifiList } = this.state
    return (
      <View className='api-page'>
        {wifiList.map((item, index) => {
          return (
            <View className='list' key={index}>
              <text>{item.SSID}</text>
              <View className='wifi-icon'>
                <View className='wifi-1'></View>
                <View className={'wifi-2 ' + (item.strength < 2 ? 'off' : '')}></View>
                <View className={'wifi-3 ' + (item.strength < 3 ? 'off' : '')}></View>
                <View className={'wifi-4 ' + (item.strength < 4 ? 'off' : '')}></View>
                {item.secure && <View className='lock'></View>}
              </View>
            </View>
          )
        })}
        {list.map((item) => {
          return (
            <Button
              key={item.id}
              className='api-page-btn'
              type='primary'
              onClick={item.func == null ? () => {} : item.func}
            >
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </Button>
          )
        })}
      </View>
    )
  }
}
