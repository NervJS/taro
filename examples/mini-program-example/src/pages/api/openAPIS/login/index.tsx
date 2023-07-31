import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-登录
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'login-code',
                func: () => {
                    Taro.login({
                        // @ts-ignore
                        appid:'1208731172335528704',
                        success: function (res) {
                            Taro.showModal({content:'Taro.login code success ' +  JSON.stringify(res)})
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
                id: 'login-token',
                func: () => {
                    Taro.login({
                        // @ts-ignore
                        appid:'1208731172335528704',
                        type:'token',
                        success: function (res) {
                            Taro.showModal({content:'Taro.login token success ' + JSON.stringify(res)})
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
