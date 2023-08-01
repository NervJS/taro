import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-实时语音
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'updateVoIPChatMuteConfig',
                func: null,
            },
            {
                id: 'subscribeVoIPVideoMembers',
                func: null,
            },
            {
                id: 'setEnable1v1Chat',
                func: null,
            },
            {
                id: 'onVoIPVideoMembersChanged',
                func: null,
            },
            {
                id: 'onVoIPChatStateChanged',
                func: null,
            },
            {
                id: 'onVoIPChatSpeakersChanged',
                func: null,
            },
            {
                id: 'onVoIPChatMembersChanged',
                func: null,
            },
            {
                id: 'onVoIPChatInterrupted',
                func: null,
            },
            {
                id: 'offVoIPVideoMembersChanged',
                func: null,
            },
            {
                id: 'offVoIPChatStateChanged',
                func: null,
            },
            {
                id: 'offVoIPChatMembersChanged',
                func: null,
            },
            {
                id: 'offVoIPChatInterrupted',
                func: null,
            },
            {
                id: 'joinVoIPChat',
                func: null,
            },
            {
                id: 'exitVoIPChat',
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
