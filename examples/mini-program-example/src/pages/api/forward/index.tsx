import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 转发
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'updateShareMenu',
                func: null,
            }, 
            {
                id: 'showShareMenu',
                func: null,
            }, 
            {
                id: 'showShareImageMenu',
                func: null,
            }, 
            {
                id: 'shareVideoMessage',
                func: null,
            }, 
            {
                id: 'shareFileMessage',
                func: null,
            }, 
            {
                id: 'onCopyUrl',
                func: null,
            }, 
            {
                id: 'offCopyUrl',
                func: null,
            }, 
            {
                id: 'hideShareMenu',
                func: null,
            }, 
            {
                id: 'getShareInfo',
                func: null,
            }, 
            {
                id: 'authPrivateMessage',
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
