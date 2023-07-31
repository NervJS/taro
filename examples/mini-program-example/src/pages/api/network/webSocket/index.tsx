import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 网络-WebSocket
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'sendSocketMessage',
                func: () => {
                    Taro.sendSocketMessage({
                        data:'test sendSocketMessage',
                        success: (res) => {
                            console.log('sendSocketMessage success ', res)
                        },
                        fail: (res) => {
                            console.log('sendSocketMessage fail ', res)
                        },
                        complete: (res) => {
                            console.log('sendSocketMessage complete ', res)
                        },
                    })
                },
            }, 
            {
                id: 'onSocketOpen',
                func: () => {
                    Taro.connectSocket({
                        url: 'www.baidu.com'
                    })
                    Taro.onSocketOpen((res) => {
                        console.log('onSocketOpen ', res)
                    })
                },
            },
            {
                id: 'onSocketMessage',
                func: () => {
                    Taro.connectSocket({
                        url: 'www.baidu.com'
                    })
                    Taro.onSocketMessage(function (res) {
                        console.log('onSocketMessage ' + res.data)
                      })
                },
            },
            {
                id: 'onSocketClose',
                func: () => {
                    Taro.connectSocket({
                        url: 'www.baidu.com'
                    })
                    Taro.onSocketOpen((res) => {
                        console.log('onSocketOpen ', res)
                        Taro.closeSocket()
                    })
                    Taro.onSocketClose(function (res) {
                        console.log('onSocketClose ', res)
                    })
                },
            },
            {
                id: 'connectSocket',
                func: () => {
                    Taro.connectSocket({
                        url: 'www.baidu.com',
                        header:{
                          'content-type': 'application/json'
                        },
                        protocols: ['protocol1'],
                        tcpNoDelay: false,
                        success: (res) => {
                            console.log('connectSocket success ', res)
                        },
                        fail: (res) => {
                            console.log('connectSocket fail ', res)
                        },
                        complete: (res) => {
                            console.log('connectSocket complete ', res)
                        },
                    })
                },
            },
            {
                id: 'SocketTask',
                func: () => {
                    Taro.connectSocket({
                        url: 'www.baidu.com',
                        success: function () {
                          console.log('connect success')
                        },
                        fail: () => {
                            console.log('connect fail')
                        }
                      }).then(task => {
                        task.send({
                            data: 'test send',
                            success: (res) => {
                                console.log('send success ', res)
                            },
                            fail: (res) => {
                                console.log('send fail ', res)
                            },
                            complete: (res) => {
                                console.log('send complete ', res)
                            },
                        })
                        task.onOpen(function (res) {
                          console.log('onOpen', res)
                          task.send({ data: 'xxx' })
                        })
                        task.onMessage(function (msg) {
                          console.log('onMessage: ', msg)
                        })
                        task.onError(function (res) {
                          console.log('onError', res)
                        })
                        task.close({
                            code: 200,
                            reason: 'test close',
                            success: (res) => {
                                console.log('close success ', res)
                            },
                            fail: (res) => {
                                console.log('close fail ', res)
                            },
                            complete: (res) => {
                                console.log('close complete ', res)
                            },                            
                        })
                        task.onClose(function (e) {
                          console.log('onClose: ', e)
                        })
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
