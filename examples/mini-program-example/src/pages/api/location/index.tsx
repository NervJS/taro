import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 位置-位置更新
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'onLocationChange',
                func: () => {
                    Taro.onLocationChange((res) => {
                        console.log('location change', res)
                    })
                    Taro.offLocationChange((res) => {
                        console.log('offLocationChange')
                    })
                },
            }, 
            {
                id: 'startLocationUpdate',
                func: () => {
                    Taro.startLocationUpdate({
                        success: function(res) {
                            console.log('startLocationUpdate success ', res)
                        },
                        fail: function(res) {
                            console.log('startLocationUpdate fail ', res)
                        },
                        complete: function(res) {
                            console.log('startLocationUpdate complete ', res)
                        },
                    })
                },
            },
            {
                id: 'stopLocationUpdate',
                func: () => {
                    Taro.stopLocationUpdate({
                        success: function (res) {
                            console.log('stopLocationUpdate success ', res)
                        },
                        fail: function (res) {
                            console.log('stopLocationUpdate fail ', res)
                        },
                    })
                },
            },
            {
                id: 'startLocationUpdateBackground',
                func: () => {
                    Taro.startLocationUpdateBackground({
                        success: function(res) {
                            console.log('startLocationUpdateBackground success ', res)
                        },
                        fail: function(res) {
                            console.log('startLocationUpdateBackground fail ', res)
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
