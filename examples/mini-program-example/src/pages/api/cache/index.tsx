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
                func: null,
            }, 
            {
                id: 'setStorage',
                func: null,
            }, 
            {
                id: 'revokeBufferURL',
                func: null,
            }, 
            {
                id: 'removeStorageSync',
                func: null,
            }, 
            {
                id: 'removeStorage',
                func: null,
            }, 
            {
                id: 'getStorageSync',
                func: null,
            }, 
            {
                id: 'getStorageInfoSync',
                func: null,
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
                func: null,
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
