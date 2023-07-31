import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import withWeapp from '@tarojs/with-weapp'
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
                func: () => {
                    const app = Taro.getApp();
                    console.log('getApp success ', app)
                },
            }, 
            {
                id: 'getCurrentPages',
                func: () => {
                    const pages = Taro.getCurrentPages();
                    console.log('getCurrentPages success ', pages);
                },
            }, 
            {
                id: 'Page',
                func: () => {
                    const pages = Taro.getCurrentPages();
                    console.log('pages...')
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
