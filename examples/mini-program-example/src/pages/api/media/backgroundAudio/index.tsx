import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-背景音频
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'stopBackgroundAudio',
                func: null,
            }, 
            {
                id: 'seekBackgroundAudio',
                func: null,
            }, 
            {
                id: 'playBackgroundAudio',
                func: null,
            }, 
            {
                id: 'pauseBackgroundAudio',
                func: null,
            }, 
            {
                id: 'onBackgroundAudioStop',
                func: null,
            }, 
            {
                id: 'onBackgroundAudioPlay',
                func: null,
            }, 
            {
                id: 'onBackgroundAudioPause',
                func: null,
            }, 
            {
                id: 'getBackgroundAudioPlayerState',
                func: null,
            }, 
            {
                id: 'getBackgroundAudioManager',
                func: null,
            }, 
            {
                id: 'BackgroundAudioManager',
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
