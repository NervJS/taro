import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-登录
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'login',
                func: () => {
                    Taro.login({
                        timeout: 5000,
                        success: function (res) {
                          if (res.code) {
                            //发起网络请求
                            Taro.request({
                              url: 'https://test.com/onLogin',
                              data: {
                                code: res.code
                              }
                            })
                          } else {
                            console.log('登录失败！' + res.errMsg)
                          }
                        },
                        fail: (res) => {
                            console.log('login fail ',res)
                        },
                        complete: (res) => {
                            console.log('login complete ',res)
                        }
                    })
                },
            }, 
            {
                id: 'checkSession',
                func: () => {
                    Taro.checkSession({
                        success: function (res) {
                          console.log('checkSession success ',res)
                        },
                        fail: function (res) {
                        console.log('checkSession fail ',res)
                        },
                        complete: (res) => {
                            console.log('checkSession complete ',res)
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
