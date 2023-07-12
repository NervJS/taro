import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 路由
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'switchTab',
                func: null,
            }, 
            {
                id: 'reLaunch',
                func: null,
            }, 
            {
                id: 'redirectTo',
                func: null,
            }, 
            {
                id: 'navigateTo',
                func: null,
            }, 
            {
                id: 'navigateBack',
                func: null,
            }, 
            {
                id: 'EventChannel',
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
