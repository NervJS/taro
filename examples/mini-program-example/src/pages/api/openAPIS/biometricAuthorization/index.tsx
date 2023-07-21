import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 开放接口-生物认证
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'startSoterAuthentication 指纹',
                func: null,
            }, 
            {
                id: 'startSoterAuthentication 人脸',
                func: null,
            }, 
            {
                id: 'startSoterAuthentication 声纹',
                func: null,
            }, 
            {
                id: 'checkIsSupportSoterAuthentication',
                func: () => {
                    Taro.checkIsSupportSoterAuthentication({
                        success: (res) => {
                            console.log('success-----', res);
                        },
                        fail: function(res) {
                            console.log('fail-----', res)
                        },
                        complete: function(res) {
                            console.log('complete-----', res)
                        },
                    })
                },
            }, 
            {
                id: 'checkIsSoterEnrolledInDevice',
                func: () => {
                    const authModes = ['fingerPrint', 'facial', 'speech'];
                    authModes.forEach((mode) => {
                        Taro.checkIsSoterEnrolledInDevice({
                            checkAuthMode: mode as any,
                            success: (res) => {
                                console.log('success-----', mode, res);
                            },
                        })
                    })
                },
            }, 
        ], 
    }
    startSoterAuthentication = (authMode) => {
        Taro.startSoterAuthentication({
            requestAuthModes: [authMode],
            challenge: 'test',
            authContent: 'apitest',
            success: () => {
                Taro.showToast({
                    title: '认证成功'
                })
            },
            fail: (err) => {
                console.error(err)
                Taro.showModal({
                    title: '失败',
                    content: '认证失败',
                    showCancel: false
                })
            }
        })
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
