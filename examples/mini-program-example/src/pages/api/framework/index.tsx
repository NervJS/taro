import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

/**
 * 框架
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'App',
                func: null,
            }, 
            {
                id: 'getApp',
                func: () => {
                    const app = Taro.getApp();
                    console.log('getApp success ', app)
                },
            }, 
            {
                id: 'getCurrentPages',
                func: () => {
                    const pages = Taro.getCurrentPages();
                    console.log('getCurrentPages success ', pages);
                },
            }, 
            {
                id: 'Page',
                func: () => {
                    @withWeapp({
                        data: {
                            theme: 'light',
                            status: 'lock',
                        },
                        onShareAppMessage() {
                          return {
                            title: 'onShareAppMessage',
                            path: 'src/pages/api/framework/index',
                          }
                        },
                        onPullDownRefresh() {
                            console.log('onPullDownRefresh success')
                        },
                        onReachBottom() {
                            console.log('onReachBottom success')
                        },
                        onHide() {
                            console.log('onHide success')
                        },
                        onUnload() {
                            console.log('onUnload success')
                        },
                        onError() {
                            console.log('onError success')
                        }
                    })
                    class _C extends React.Component {
                        render() {
                          return (
                            <Button>testPage</Button>
                          )
                        }
                    }
                }
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
