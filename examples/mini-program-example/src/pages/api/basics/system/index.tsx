import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 基础-系统
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'openSystemBluetoothSetting',
                func: null,
            }, 
            {
                id: 'openAppAuthorizeSetting',
                func: () => {
                    Taro.openAppAuthorizeSetting({
                        success (res) {
                            console.log('success-----', res);
                        },
                        fail (res) {
                            console.log('fail-----', res);
                        },
                        complete (res) {
                            console.log('complete-----', res);
                        }
                    })
                },
            }, 
            {
                id: 'getWindowInfo',
                func: null,
            }, 
            {
                id: 'getSystemSetting',
                func: () => {
                    const systemSetting = Taro.getSystemSetting()
                    Taro.showToast({
                        title: 'success'
                    })
                    console.log('success', systemSetting);
                },
            }, 
            {
                id: 'getSystemInfoSync',
                func: () => {
                    try {
                        const res = Taro.getSystemInfoSync()
                        console.log('getSystemInfoSync success ', res)
                      } catch (e) {
                        console.log('getSystemInfoSync exception')
                      }
                },
            }, 
            {
                id: 'getSystemInfoAsync',
                func: null,
            }, 
            {
                id: 'getSystemInfo',
                func: () => {
                    Taro.getSystemInfo({
                        success: function (res) {
                          console.log('getSystemInfo success ', res)
                        },
                        fail: function (res) {
                            console.log('getSystemInfo fail ', res)
                        },
                        complete: function (res) {
                            console.log('getSystemInfo complete ', res)
                        },
                    })
                },
            }, 
            {
                id: 'getDeviceInfo',
                func: null,
            }, 
            {
                id: 'getAppBaseInfo',
                func: null,
            }, 
            {
                id: 'getAppAuthorizeSetting',
                func: null,
            }, 
        ], 
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
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

