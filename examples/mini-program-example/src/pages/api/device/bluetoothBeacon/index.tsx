import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-蓝牙-信标(Beacon)
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'stopBeaconDiscovery',
                func: null,
            }, 
            {
                id: 'startBeaconDiscovery',
                func: null,
            }, 
            {
                id: 'onBeaconUpdate',
                func: null,
            }, 
            {
                id: 'onBeaconServiceChange',
                func: null,
            }, 
            {
                id: 'offBeaconUpdate',
                func: null,
            }, 
            {
                id: 'offBeaconServiceChange',
                func: null,
            }, 
            {
                id: 'getBeacons',
                func: null,
            }, 
            {
                id: 'IBeaconInfo',
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
