import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

/**
 * 基础-生命周期
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'getLaunchOptionsSync',
                func: null,
            }, 
            {
                id: 'getEnterOptionsSync',
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

