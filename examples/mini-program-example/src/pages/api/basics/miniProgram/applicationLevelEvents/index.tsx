import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

/**
 * 基础-应用级事件
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'onUnhandledRejection',
                func: null,
            }, 
            {
                id: 'onThemeChange',
                func: null,
            }, 
            {
                id: 'onPageNotFound',
                func: null,
            }, 
            {
                id: 'onError',
                func: null,
            }, 
            {
                id: 'onAudioInterruptionEnd',
                func: null,
            }, 
            {
                id: 'onAudioInterruptionBegin',
                func: null,
            }, 
            {
                id: 'onAppShow',
                func: null,
            }, 
            {
                id: 'onAppHide',
                func: null,
            }, 
            {
                id: 'offThemeChange',
                func: null,
            }, 
            {
                id: 'offPageNotFound',
                func: null,
            }, 
            {
                id: 'offError',
                func: null,
            }, 
            {
                id: 'offAudioInterruptionEnd',
                func: null,
            }, 
            {
                id: 'offAudioInterruptionBegin',
                func: null,
            }, 
            {
                id: 'offAppShow',
                func: null,
            }, 
            {
                id: 'offAppHide',
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
                            <Button
                                className='api-page-btn'
                                type='primary'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </Button>
                        )
                    })
                }
            </View>
        )
    }
}

