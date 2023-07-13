import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Slider } from '@tarojs/components'
import './index.scss'

/**
 * 设备-屏幕
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'setVisualEffectOnCapture',
                func: null,
            },
            {
                id: 'setScreenBrightness',
                func: () => {
                    Taro.setScreenBrightness({
                        value: 1,
                        success: (res) => {
                            this.setState({
                                brightValue: 1,
                            })
                            console.log('success-----', res);
                        },
                        fail: (res) => {
                            console.log('fail-----', res);
                        }
                    })
                },
            },
            {
                id: 'setKeepScreenOn',
                func: () => {
                    Taro.setKeepScreenOn({
                        keepScreenOn: true,
                        success: (res) => {
                            console.log('success-----', res);
                        }
                    })
                },
            },
            {
                id: 'onUserCaptureScreen',
                func: () => {
                    Taro.onUserCaptureScreen((res) => {
                        console.log('success-----用户截屏了', res);
                    })
                },
            },
            {
                id: 'offUserCaptureScreen',
                func: () => {
                    Taro.offUserCaptureScreen((res) => {
                        console.log('success-----取消截屏事件监听', res);
                    })
                },
            },
            {
                id: 'getScreenBrightness',
                func: () => {
                    Taro.getScreenBrightness({
                        success: (res) => {
                            console.log('success-----', res);
                        }
                    })
                },
            },
        ], 
        brightValue: 0.5,
    }

    changeBrightness = (e) => {
        let value = parseFloat(e.detail.value.toFixed(1));
        this.setState({
            brightValue: value,
        })
        Taro.setScreenBrightness({
            value: value,
            success: (res) => {
                console.log('success-----', res);
            },
            fail: (res) => {
                console.log('fail-----', res);
            }
        })
    }
    render () {
        const { list, brightValue } = this.state;
        return (
            <View className='api-page'>
                <View>当前屏幕亮度</View>
                <Text>{brightValue}</Text>
                <Slider step={0.1} value={brightValue} min={0} max={1} onChange={this.changeBrightness}/>
                {
                    list.map((item) => {
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
