import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-下拉更新
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'stopPullDownRefresh',
                func: () => {
                    Taro.startPullDownRefresh({
                        success: (res) => {
                            console.log('startPullDownRefresh success ', res)
                            setTimeout(() => {
                                Taro.stopPullDownRefresh({
                                    success: (res) => {
                                        console.log('stopPullDownRefresh success ', res)
                                    },
                                    fail: (res) => {
                                        console.log('stopPullDownRefresh fail ', res)
                                    },
                                    complete: (res) => {
                                        console.log('stopPullDownRefresh complete ', res)
                                    },
                                })
                            }, 5000)
                        }
                    }) 
                },
            }, 
            {
                id: 'startPullDownRefresh',
                func: () => {
                    Taro.startPullDownRefresh({
                        success: (res) => {
                            console.log('startPullDownRefresh success ', res)
                        },
                        fail: (res) => {
                            console.log('startPullDownRefresh fail ', res)
                        },
                        complete: (res) => {
                            console.log('startPullDownRefresh complete ', res)
                        },
                    })
                },
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
