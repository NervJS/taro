import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 框架
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'App',
                func: null,
            }, 
            {
                id: 'getApp',
                func: null,
            }, 
            {
                id: 'getCurrentPages',
                func: () => {
                    const pages = Taro.getCurrentPages();
                    console.log('success', pages);
                },
            }, 
            {
                id: 'Page',
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
