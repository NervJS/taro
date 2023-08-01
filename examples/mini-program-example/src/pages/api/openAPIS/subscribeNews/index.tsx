import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-订阅消息
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'requestSubscribeMessage',
                func: null,
            }, 
            {
                id: 'requestSubscribeDeviceMessage',
                func: null,
            }, 
        ], 
    }
    render () {
        let { list } = this.state;
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
