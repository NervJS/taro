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
                        console.log('location change', res.accuracy, res.altitude, res.horizontalAccuracy, res.latitude, res.longitude, res.speed, res.verticalAccuracy)
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
                            console.log('startLocationUpdate success ')
                        },
                        fail: function(res) {
                            console.log('startLocationUpdate fail ')
                        },
                    })
                    setTimeout(() => {
                        Taro.stopLocationUpdate({
                            success: function(res) {
                                console.log('stopLocationUpdate success ', res)
                            },
                            fail: function(res) {
                                console.log('stopLocationUpdate fail ', res)
                            },
                        })
                    }, 10000)
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
