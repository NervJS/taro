import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import './index.scss'

/**
 * 设备-电话
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'makePhoneCall',
                func: () => {
                    Taro.makePhoneCall({
                        phoneNumber: '15527988132',
                        success: (res) => {
                            console.log('success-----', res);
                        }
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
