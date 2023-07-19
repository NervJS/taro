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
                func: null,
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
                id: 'System',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/basics/system/index'
                    });
                },
            }, 
            {
                id: 'Update',
                func: null,
            }, 
            {
                id: 'MiniProgram',
                func: null,
            }, 
            {
                id: 'Debug',
                func: null,
            }, 
            {
                id: 'Performance',
                func: null,
            }, 
            {
                id: 'Encryption',
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
