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
                    Taro.stopPullDownRefresh({
                        success(res) {
                            Taro.hideToast()
                            console.log(res, new Date())
                        },
                        fail(res) {
                            Taro.hideToast()
                            console.log(res, new Date())
                        },
                        complete(res) {
                          Taro.hideToast()
                          console.log(res, new Date())
                        },
                    })
                },
            }, 
            {
                id: 'startPullDownRefresh',
                func: () => {
                    Taro.startPullDownRefresh({
                        success(res) {
                            Taro.hideToast()
                            console.log(res, new Date())
                        },
                        fail(res) {
                            Taro.hideToast()
                            console.log(res, new Date())
                        },
                        complete(res) {
                          Taro.hideToast()
                          console.log(res, new Date())
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
