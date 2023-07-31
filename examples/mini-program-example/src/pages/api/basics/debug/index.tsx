import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 基础-调试
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'setEnableDebug',
                func: null,
            }, 
            {
                id: 'getRealtimeLogManager',
                func: null,
            }, 
            {
                id: 'getLogManager',
                func: null,
            }, 
            {
                id: 'console',
                func: null,
            }, 
            {
                id: 'LogManager',
                func: null,
            }, 
            {
                id: 'RealtimeLogManager',
                func: null,
            }, 
            {
                id: 'RealtimeTagLogManager',
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
                            <View
                                className='api-page-btn'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

