import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-电池
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'getBatteryInfo',
                func: () => {
                    Taro.getBatteryInfo({
                        success: (res) => {
                            console.log('success-----', res);
                            this.setState({
                                batteryInfo: res,
                            })
                        }
                    })
                },
            }, 
            {
                id: 'getBatteryInfoSync',
                func: null,
            }, 
        ], 
        batteryInfo: {},
    }
    render () {
        const { list, batteryInfo } = this.state;
        return (
            <View className='api-page'>
                <View>是否正在充电：{batteryInfo.isCharging ? '是' : '否'}</View>
                <View>设备电量：{batteryInfo.level}%</View>
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
