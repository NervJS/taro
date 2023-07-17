import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 基础
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'env',
                func: null,
            }, 
            {
                id: 'canIUse',
                func: () => {
                    console.log('Taro.canIUse openBluetoothAdapter', Taro.canIUse('openBluetoothAdapter'));
                },
            },
            {
                id: 'canIuseWebp',
                func: null,
            }, 
            {
                id: 'base64ToArrayBuffer',
                func: null,
            }, 
            {
                id: 'arrayBufferToBase64',
                func: null,
            }, 
            {
                id: 'perload',
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
