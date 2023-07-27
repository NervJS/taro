import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
/**
 * 基础-系统
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'openSystemBluetoothSetting',
                func: null,
            }, 
            {
                id: 'openAppAuthorizeSetting',
                func: () => {
                    Taro.openAppAuthorizeSetting({
                        success (res) {
                            Taro.showModal({content:'Taro.openAppAuthorizeSetting success ' +  JSON.stringify(res)})
                            console.log('success-----', res);
                        },
                        fail (res) {
                            Taro.showModal({content:'Taro.openAppAuthorizeSetting fail ' +  JSON.stringify(res)})
                            console.log('fail-----', res);
                        },
                        complete (res) {
                            Taro.showModal({content:'Taro.openAppAuthorizeSetting complete ' +  JSON.stringify(res)})
                            console.log('complete-----', res);
                        }
                    })
                },
            }, 
            {
                id: 'getWindowInfo',
                func: async()=>{
                    const res = await Taro.getWindowInfo()
                    Taro.showModal({content:'Taro.getWindowInfo success ' +  JSON.stringify(res)})
                    console.log('Taro.getWindowInfo success',res)
                },
            }, 
            {
                id: 'getSystemSetting',
                func: () => {
                    const res = Taro.getSystemSetting()
                    Taro.showModal({content:'Taro.getSystemInfoSync success ' +  JSON.stringify(res)})
                    console.log('Taro.getSystemSetting success',res)
                },
            }, 
            {
                id: 'getSystemInfoSync',
                func: () => {
                    try {
                        const res = Taro.getSystemInfoSync()
                        Taro.showModal({content:'Taro.getSystemInfoSync success ' +  JSON.stringify(res)})
                        console.log('Taro.getSystemInfoSync success',res)
                      } catch (e) {
                        Taro.showModal({content:'Taro.getSystemInfoSync exception ' +  JSON.stringify(e)})
                        console.error('Taro.getSystemInfoSync success',e)
                      }
                },
            }, 
            {
                id: 'getSystemInfoAsync',
                func: null,
            }, 
            {
                id: 'getSystemInfo',
                func: () => {
                    Taro.getSystemInfo({
                        success: function (res) {
                          console.log('getSystemInfo success ', res)
                        },
                        fail: function (res) {
                            console.log('getSystemInfo fail ', res)
                        },
                        complete: function (res) {
                            console.log('getSystemInfo complete ', res)
                        },
                    })
                },
            }, 
            {
                id: 'getDeviceInfo',
                func: () =>{
                    let res = Taro.getDeviceInfo()
                    Taro.showModal({content:'Taro.getDeviceInfo success ' +  JSON.stringify(res)})
                    console.log('Taro.getSystemInfoSync getDeviceInfo',res)
                },
            }, 
            {
                id: 'getAppBaseInfo',
                func: async()=>{
                    let res = await Taro.getAppBaseInfo();
                    console.log("Taro.getAppBaseInfo",res);
                    Taro.showModal({content:'Taro.getAppBaseInfo success ' +  JSON.stringify(res)})
                },
            }, 
            {
                id: 'getAppAuthorizeSetting',
                func: async()=>{
                    let res = await Taro.getAppAuthorizeSetting()
                    console.log("Taro.getAppAuthorizeSetting",res);
                    Taro.showModal({content:'Taro.getAppAuthorizeSetting success ' +  JSON.stringify(res)})
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

