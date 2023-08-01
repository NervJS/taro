import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 数据分析
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'reportMonitor',
                func: null,
            }, 
            {
                id: 'reportEvent',
                func: null,
            }, 
            {
                id: 'reportAnalytics',
                func: null,
            }, 
            {
                id: 'getExptInfoSync',
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
