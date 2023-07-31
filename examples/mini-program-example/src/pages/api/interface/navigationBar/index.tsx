import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-导航栏
 * @returns 
 */

export default class Index extends React.Component {
    state = {
        list: [
            {
                id: 'showNavigationBarLoading',
                func: null,
            }, 
            {
                id: 'setNavigationBarTitle',
                func: () => {
                    Taro.setNavigationBarTitle({
                        title: '当前页面',
                        success: function (res) {
                            console.log('setNavigationBarTitle success ', res)
                        },
                        fail: function(res) {
                            console.log('setNavigationBarTitle fail ', res)
                        },
                        complete: function(res) {
                            console.log('setNavigationBarTitle   complete ', res)
                        },
                    })
                },
            }, 
            {
                id: 'setNavigationBarColor',
                func: null,
            }, 
            {
                id: 'hideNavigationBarLoading',
                func: null,
            }, 
            {
                id: 'hideHomeButton',
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
