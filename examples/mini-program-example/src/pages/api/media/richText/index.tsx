import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-富文本
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'EditorContext',
                func: null,
            }, 
        ], 
    }
    render () {
        const { list } = this.state;
        return (
            <View className='api-page'>
                {
                    list.map((item) => {
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
