import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-视频号
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'reserveChannelsLive',
                func: null,
            },
            {
                id: 'openChannelsUserProfile',
                func: null,
            },
            {
                id: 'openChannelsLive',
                func: null,
            },
            {
                id: 'openChannelsEvent',
                func: null,
            },
            {
                id: 'openChannelsActivity',
                func: null,
            },
            {
                id: 'getChannelsLiveNoticeInfo',
                func: null,
            },
            {
                id: 'getChannelsLiveInfo',
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
