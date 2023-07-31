import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 基础
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'Request',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/request/index'
                    });
                }
            }, 
            {
                id: 'Download',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/download/index'
                    });
                }
            }, 
            {
                id: 'Upload',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/upload/index'
                    });
                }
            }, 
            {
                id: 'WebSocket',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/webSocket/index'
                    });
                }
            }, 
            {
                id: 'mDNS',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/mDNS/index'
                    });
                }
            }, 
            {
                id: 'TCPCommunications',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/TCPCommunications/index'
                    });
                }
            }, 
            {
                id: 'UDPCommunications',
                func: () => {
                    Taro.navigateTo({
                        url: '/pages/api/network/UDPCommunications/index'
                    });
                }
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
