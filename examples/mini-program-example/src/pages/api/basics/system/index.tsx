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
                func: null,
            }, 
            {
                id: 'getWindowInfo',
                func: null,
            }, 
            {
                id: 'getSystemSetting',
                func: () => {
                    const systemSetting = Taro.getSystemSetting()
                    console.log('success', systemSetting);
                },
            }, 
            {
                id: 'getSystemInfoSync',
                func: null,
            }, 
            {
                id: 'getSystemInfoAsync',
                func: null,
            }, 
            {
                id: 'getSystemInfo',
                func: null,
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

