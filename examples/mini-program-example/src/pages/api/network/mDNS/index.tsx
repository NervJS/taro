import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 网络-mDNS
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'stopLocalServiceDiscovery',
                func: null,
            },
            {
                id: 'startLocalServiceDiscovery',
                func: null,
            },
            {
                id: 'onLocalServiceResolveFail',
                func: null,
            },
            {
                id: 'onLocalServiceLost',
                func: null,
            },
            {
                id: 'onLocalServiceFound',
                func: null,
            },
            {
                id: 'onLocalServiceDiscoveryStop',
                func: null,
            },
            {
                id: 'offLocalServiceResolveFail',
                func: null,
            },
            {
                id: 'offLocalServiceLost',
                func: null,
            },
            {
                id: 'offLocalServiceFound',
                func: null,
            },
            {
                id: 'offLocalServiceDiscoveryStop',
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
