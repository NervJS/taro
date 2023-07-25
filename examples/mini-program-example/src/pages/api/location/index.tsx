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
                        console.log('onLocationChange ', res)
                    })
                    Taro.offLocationChange((res) => {
                        console.log('offLocationChange ', res)
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
                    Taro.startLocationUpdate({
                        success: () => {
                            Taro.stopLocationUpdate({
                                success: function (res) {
                                    console.log('stopLocationUpdate success ', res)
                                },
                                fail: function (res) {
                                    console.log('stopLocationUpdate fail ', res)
                                },
                                complete: function(res) {
                                    console.log('stopLocationUpdate complete ', res)
                                },
                            })
                        }
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
                        complete: function(res) {
                            console.log('startLocationUpdateBackground complete ', res)
                        },
                    })
                },
            },
            {
                id: 'offLocationChange',
                func: () => {
                    Taro.onLocationChange((res) => {
                        console.log('onLocationChange ', res)
                    })
                    Taro.offLocationChange((res) => {
                        console.log('offLocationChange ', res)
                    })
                },
            },
            {
                id: 'onLocationChangeError',
                func: () => {
                    Taro.onLocationChange((res) => {
                        console.log('onLocationChange ', res)
                    })
                    Taro.onLocationChangeError((res) => {
                        console.log('onLocationChangeError ', res)
                    })
                    Taro.offLocationChange((res) => {
                        console.log('offLocationChange ', res)
                    })
                },
                
            },
            {
                id: 'offLocationChangeError',
                func: () => {
                    Taro.onLocationChange((res) => {
                        console.log('onLocationChange ', res)
                    })
                    Taro.offLocationChange((res) => {
                        console.log('offLocationChange ', res)
                    })
                    Taro.offLocationChangeError((res) => {
                        console.log('offLocationChangeError ', res)
                    })
                },
                
            },
            {
                id: 'getLocation',
                func: () => {
                    Taro.getLocation({
                        altitude: 'true',
                        type: 'wgs84',
                        highAccuracyExpireTime: 40000,
                        isHighAccuracy: true,                        
                        success: (res) => {
                            console.log('getLocation success ', res)
                        },
                        fail: (res) => {
                            console.log('getLocation fail ', res)
                        },
                        complete: (res) => {
                            console.log('getLocation complete ', res)
                        },
                    })
                },
                
            },
            {
                id: 'chooseLocation',
                func: () => {
                    Taro.chooseLocation({
                        latitude: 45,
                        longitude: 89,                      
                        success: (res) => {
                            console.log('chooseLocation success ', res)
                        },
                        fail: (res) => {
                            console.log('chooseLocation fail ', res)
                        },
                        complete: (res) => {
                            console.log('chooseLocation complete ', res)
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
