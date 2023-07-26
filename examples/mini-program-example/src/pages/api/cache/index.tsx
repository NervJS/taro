import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

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
                    try {
                        Taro.setStorageSync('testKey','testValue')
                        console.log('setStorageSync')
                    } catch (error) {
                        console.log('setStorageSync error ', error)
                    }
                },
            }, 
            {
                id: 'setStorage',
                func: () => {
                    Taro.setStorage({
                        key: "testKey",
                        data: "testValue"
                    })
                    console.log('setStorage')
                },
            }, 
            {
                id: 'revokeBufferURL',
                func: null,
            }, 
            {
                id: 'removeStorageSync',
                func: () => {
                    try {
                        Taro.removeStorageSync('testKey')
                        console.log('removeStorageSync')
                    } catch (error) {
                        console.log('removeStorageSync error ', error)
                    }
                },
            }, 
            {
                id: 'removeStorage',
                func: null,
            }, 
            {
                id: 'getStorageSync',
                func: () => {
                    try {
                        Taro.setStorageSync('testKey','testValue')
                        console.log('setStorageSync')
                        var value = Taro.getStorageSync('testKey')
                        if (value) {
                            console.log('getStorageSync ', value)
                        }    
                    } catch (error) {
                        console.log('getStorageSync error ', error)
                    }
                },
            }, 
            {
                id: 'getStorageInfoSync',
                func: () => {
                    try {
                        Taro.setStorageSync('testKey','testValue')
                        console.log('setStorageSync')
                        const res = Taro.getStorageInfoSync()
                        console.log('getStorageInfoSync ', res)
                      } catch (e) {
                        console.log('getStorageInfoSync error', e)
                      }
                },
            }, 
            {
                id: 'getStorageInfo',
                func: null,
            }, 
            {
                id: 'getStorage',
                func: null,
            }, 
            {
                id: 'createBufferURL',
                func: null,
            }, 
            {
                id: 'createStorageSync',
                func: null,
            }, 
            {
                id: 'clearStorageSync',
                func: () => {
                    try {
                        Taro.clearStorageSync()
                        console.log('clearStorageSync ')
                      } catch(e) {
                        console.log('clearStorageSync error', e)
                      }
                },
            }, 
            {
                id: 'clearStorage',
                func: null,
            }, 
            {
                id: 'PeriodicUpdate',
                func: null,
            }, 
            {
                id: 'CacheManager',
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
