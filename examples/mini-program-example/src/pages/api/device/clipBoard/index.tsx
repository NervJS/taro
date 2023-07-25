import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-剪切板
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'setClipboardData',
                func: () => {
                    Taro.setClipboardData({
                        data: this.state.value,
                        success(res) {
                          console.log('setClipboardData success ', res)
                        },
                        fail(res) {
                            console.log('setClipboardData fail ', res)
                        },
                        complete(res) {
                            console.log('setClipboardData complete ', res)
                        },
                      })
                },
            }, 
            {
                id: 'getClipboardData',
                func: () => {
                    Taro.getClipboardData({
                        success(res) {
                            console.log('getClipboardData success ', res)
                        },
                        fail(res) {
                            console.log('getClipboardData fail ', res)
                        },
                        complete(res) {
                            console.log('getClipboardData complete ', res)
                        },
                      })
                },
            }, 
        ], 
        value: '复制的内容',
        pasted: '',
    }
    render () {
        let { list, value, pasted } = this.state;
        return (
            <View className='api-page'>
                <View>复制内容：{value}</View>
                <View>粘贴内容：{pasted}</View>
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
