import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-音频
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'stopVoice',
                func: null,
            },
            {
                id: 'setInnerAudioOption',
                func: null,
            },
            {
                id: 'playVoice',
                func: null,
            },
            {
                id: 'pauseVoice',
                func: null,
            },
            {
                id: 'getAvailableAudioSources',
                func: null,
            },
            {
                id: 'createWebAudioContext',
                func: null,
            },
            {
                id: 'createMediaAudioPlayer',
                func: null,
            },
            {
                id: 'createInnerAudioContext',
                func: null,
            },
            {
                id: 'createAudioContext',
                func: null,
            },
            {
                id: 'AudioBuffer',
                func: null,
            },
            {
                id: 'AudioContext',
                func: null,
            },
            {
                id: 'InnerAudioContext',
                func: null,
            },
            {
                id: 'MediaAudioPlayer',
                func: null,
            },
            {
                id: 'WebAudioContext',
                func: null,
            },
            {
                id: 'WebAudioContextNode',
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
